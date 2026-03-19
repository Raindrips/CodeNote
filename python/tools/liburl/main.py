"""
main.py — Visual cURL Client
Single-file Python + Tkinter HTTP client that assembles and executes
real curl commands via subprocess.  Architecture: MVP pattern.
"""

import json
import shlex
import subprocess
import threading
import tkinter as tk
from tkinter import messagebox, scrolledtext, ttk

# ─────────────────────────────────────────────
#  UTILITY
# ─────────────────────────────────────────────

def _font_exists(name: str) -> bool:
    try:
        import tkinter.font as tkfont
        root = tk.Tk()
        root.withdraw()
        exists = name in tkfont.families()
        root.destroy()
        return exists
    except Exception:  # noqa: BLE001
        return False


# ─────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────

class CurlApp:
    """Top-level application: wires Model → Presenter → View and starts the loop."""

    def __init__(self) -> None:
        model = CurlModel()
        presenter = CurlPresenter(model)
        self._view = CurlView(presenter)

    def run(self) -> None:
        self._view.mainloop()



# ─────────────────────────────────────────────
#  MODEL
# ─────────────────────────────────────────────
class CurlModel:
    """Pure-data model: holds request parameters, builds the curl argv list."""

    METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]

    def build_argv(
        self,
        method: str,
        url: str,
        headers_text: str,
        body_text: str,
    ) -> list[str]:
        """Return the curl argument list (no shell quoting needed for subprocess)."""
        argv = ["curl", "-i", "-s", "-X", method]

        for raw_line in headers_text.splitlines():
            line = raw_line.strip()
            if line:
                argv += ["-H", line]

        body = body_text.strip()
        if body:
            argv += ["-d", body]

        argv.append(url.strip())
        return argv

    @staticmethod
    def argv_to_display_string(argv: list[str]) -> str:
        """Convert an argv list to a readable shell-like string."""
        return " ".join(shlex.quote(a) for a in argv)


# ─────────────────────────────────────────────
#  PRESENTER
# ─────────────────────────────────────────────
class CurlPresenter:
    """
    Mediates between View and Model.
    All business logic lives here; View only calls presenter methods.
    """

    def __init__(self, model: CurlModel) -> None:
        self._model = model
        self._view: "CurlView | None" = None
        self._lock = threading.Lock()
        self._running = False

    def bind_view(self, view: "CurlView") -> None:
        self._view = view

    # ── called by the View ──────────────────────────────────────────────

    def on_params_changed(self, method: str, url: str, headers: str, body: str) -> None:
        """Rebuild the preview string whenever inputs change."""
        argv = self._model.build_argv(method, url, headers, body)
        preview = self._model.argv_to_display_string(argv)
        self._view.set_preview(preview)

    def on_execute(self, method: str, url: str, headers: str, body: str) -> None:
        """Validate inputs then kick off the curl subprocess on a background thread."""
        if not url.strip():
            messagebox.showwarning("Missing URL", "Please enter a request URL.")
            return

        if self._running:
            messagebox.showinfo("Busy", "A request is already in progress.")
            return

        argv = self._model.build_argv(method, url, headers, body)
        preview = self._model.argv_to_display_string(argv)
        self._view.set_preview(preview)
        self._view.set_response("")
        self._view.set_status("⏳  Running…", "running")
        self._view.set_execute_state(disabled=True)

        thread = threading.Thread(
            target=self._run_curl,
            args=(argv,),
            daemon=True,
        )
        thread.start()

    # ── private ─────────────────────────────────────────────────────────

    def _run_curl(self, argv: list[str]) -> None:
        self._running = True
        try:
            result = subprocess.run(
                argv,
                capture_output=True,
                text=True,
                timeout=60,
            )
            stdout = result.stdout
            stderr = result.stderr
            output = stdout
            if stderr:
                output += f"\n\n── stderr ──\n{stderr}"
            self._view.after_safe(self._view.set_response, output)
            self._view.after_safe(self._view.set_status, "✅  Done", "ok")
        except FileNotFoundError:
            self._view.after_safe(
                self._view.set_response,
                "❌  Error: 'curl' not found. Make sure curl is installed and on PATH.",
            )
            self._view.after_safe(self._view.set_status, "❌  Error", "error")
        except subprocess.TimeoutExpired:
            self._view.after_safe(
                self._view.set_response,
                "❌  Error: Request timed out (> 60 s).",
            )
            self._view.after_safe(self._view.set_status, "❌  Timeout", "error")
        except Exception as exc:  # noqa: BLE001
            self._view.after_safe(self._view.set_response, f"❌  Unexpected error:\n{exc}")
            self._view.after_safe(self._view.set_status, "❌  Error", "error")
        finally:
            self._running = False
            self._view.after_safe(self._view.set_execute_state, False)


# ─────────────────────────────────────────────
#  VIEW
# ─────────────────────────────────────────────
class CurlView(tk.Tk):
    """
    Pure presentation layer.  Builds and manages all Tkinter widgets.
    Delegates every user action to the presenter.
    """

    # ── colour / font constants ─────────────────────────────────────────
    BG          = "#1E1E2E"
    BG_PANEL    = "#27273A"
    BG_INPUT    = "#13131F"
    FG          = "#CDD6F4"
    FG_DIM      = "#585B70"
    ACCENT      = "#89B4FA"
    ACCENT2     = "#CBA6F7"
    GREEN       = "#A6E3A1"
    RED         = "#F38BA8"
    YELLOW      = "#F9E2AF"
    FONT_MONO   = ("Cascadia Code", 11) if _font_exists("Cascadia Code") else ("Courier", 11)
    FONT_UI     = ("Segoe UI", 10)
    FONT_LABEL  = ("Segoe UI", 9)
    FONT_TITLE  = ("Segoe UI Semibold", 12)

    def __init__(self, presenter: CurlPresenter) -> None:
        super().__init__()
        self._presenter = presenter
        presenter.bind_view(self)

        self.title("✦ Visual cURL Client")
        self.geometry("920x780")
        self.minsize(700, 580)
        self.configure(bg=self.BG)

        self._setup_styles()
        self._build_ui()
        self._bind_trace()
        self._refresh_preview()

    # ── style sheet ─────────────────────────────────────────────────────

    def _setup_styles(self) -> None:
        s = ttk.Style(self)
        s.theme_use("clam")

        # general
        s.configure(".", background=self.BG, foreground=self.FG,
                     fieldbackground=self.BG_INPUT, troughcolor=self.BG_PANEL,
                     bordercolor=self.FG_DIM, darkcolor=self.BG, lightcolor=self.BG,
                     font=self.FONT_UI)

        # frames
        s.configure("Card.TFrame", background=self.BG_PANEL, relief="flat")
        s.configure("TFrame", background=self.BG)

        # labels
        s.configure("TLabel", background=self.BG, foreground=self.FG)
        s.configure("Dim.TLabel", background=self.BG, foreground=self.FG_DIM,
                    font=self.FONT_LABEL)
        s.configure("Title.TLabel", background=self.BG, foreground=self.ACCENT,
                    font=self.FONT_TITLE)

        # combobox
        s.configure("TCombobox", selectbackground=self.BG_INPUT,
                     selectforeground=self.ACCENT, insertcolor=self.ACCENT,
                     arrowcolor=self.ACCENT)
        s.map("TCombobox",
              fieldbackground=[("readonly", self.BG_INPUT)],
              foreground=[("readonly", self.ACCENT)],
              selectbackground=[("readonly", self.BG_INPUT)])

        # entry
        s.configure("TEntry", insertcolor=self.ACCENT,
                     foreground=self.FG, fieldbackground=self.BG_INPUT)

        # notebook
        s.configure("TNotebook", background=self.BG, tabmargins=[0, 0, 0, 0],
                     borderwidth=0)
        s.configure("TNotebook.Tab", background=self.BG_PANEL,
                     foreground=self.FG_DIM, padding=[14, 6],
                     font=self.FONT_LABEL)
        s.map("TNotebook.Tab",
              background=[("selected", self.BG_INPUT)],
              foreground=[("selected", self.ACCENT)])

        # execute button
        s.configure("Exec.TButton",
                     background=self.ACCENT, foreground=self.BG,
                     font=("Segoe UI Semibold", 10),
                     padding=[20, 8], relief="flat", borderwidth=0)
        s.map("Exec.TButton",
              background=[("active", self.ACCENT2), ("disabled", self.FG_DIM)],
              foreground=[("disabled", self.BG)])

        # small copy button
        s.configure("Copy.TButton", background=self.BG_PANEL,
                     foreground=self.FG_DIM, font=self.FONT_LABEL,
                     padding=[8, 3], relief="flat")
        s.map("Copy.TButton",
              foreground=[("active", self.ACCENT)])

        # scrollbars
        s.configure("TScrollbar", background=self.BG_PANEL,
                     troughcolor=self.BG_INPUT, arrowcolor=self.FG_DIM,
                     borderwidth=0, relief="flat")

        # separator
        s.configure("TSeparator", background=self.FG_DIM)

    # ── widget construction ──────────────────────────────────────────────

    def _build_ui(self) -> None:
        # ── root grid
        self.columnconfigure(0, weight=1)
        self.rowconfigure(2, weight=1)  # config + response share space
        self.rowconfigure(3, weight=1)

        # ── header bar ─────────────────────────────────────────────────
        hdr = ttk.Frame(self, style="Card.TFrame", padding=(12, 8))
        hdr.grid(row=0, column=0, sticky="ew", padx=12, pady=(12, 0))
        hdr.columnconfigure(1, weight=1)

        ttk.Label(hdr, text="METHOD", style="Dim.TLabel").grid(
            row=0, column=0, sticky="w")
        ttk.Label(hdr, text="URL", style="Dim.TLabel", padding=(10, 0, 0, 0)).grid(
            row=0, column=1, sticky="w")

        self._method_var = tk.StringVar(value="GET")
        self._method_cb = ttk.Combobox(
            hdr, textvariable=self._method_var,
            values=CurlModel.METHODS,
            state="readonly", width=10,
        )
        self._method_cb.grid(row=1, column=0, sticky="w", pady=(2, 0))

        self._url_var = tk.StringVar()
        url_entry = ttk.Entry(hdr, textvariable=self._url_var, font=self.FONT_MONO)
        url_entry.grid(row=1, column=1, sticky="ew", padx=(10, 0), pady=(2, 0))

        self._exec_btn = ttk.Button(
            hdr, text="▶  Execute",
            style="Exec.TButton",
            command=self._on_execute,
        )
        self._exec_btn.grid(row=1, column=2, padx=(10, 0), pady=(2, 0))

        # ── curl preview ────────────────────────────────────────────────
        prev_frame = ttk.Frame(self, padding=(12, 6, 12, 0))
        prev_frame.grid(row=1, column=0, sticky="ew")
        prev_frame.columnconfigure(0, weight=1)

        pbar = ttk.Frame(prev_frame, style="Card.TFrame", padding=(10, 6))
        pbar.grid(row=0, column=0, sticky="ew")
        pbar.columnconfigure(1, weight=1)

        ttk.Label(pbar, text="PREVIEW", style="Dim.TLabel").grid(
            row=0, column=0, sticky="w")
        ttk.Button(pbar, text="Copy", style="Copy.TButton",
                   command=self._copy_preview).grid(
            row=0, column=2, sticky="e")

        self._preview_var = tk.StringVar(value="curl …")
        preview_lbl = tk.Label(
            pbar, textvariable=self._preview_var,
            bg=self.BG_INPUT, fg=self.YELLOW,
            font=self.FONT_MONO, anchor="w",
            padx=6, pady=4,
            wraplength=0,  # no wrap, scroll instead
        )
        preview_lbl.grid(row=1, column=0, columnspan=3, sticky="ew", pady=(4, 0))
        pbar.columnconfigure(0, weight=1)

        # ── config notebook ─────────────────────────────────────────────
        nb_outer = ttk.Frame(self, padding=(12, 6, 12, 0))
        nb_outer.grid(row=2, column=0, sticky="nsew")
        nb_outer.rowconfigure(0, weight=1)
        nb_outer.columnconfigure(0, weight=1)

        nb = ttk.Notebook(nb_outer)
        nb.grid(row=0, column=0, sticky="nsew")

        # Headers tab
        hdr_tab = ttk.Frame(nb, padding=6)
        nb.add(hdr_tab, text="  Headers  ")
        hdr_tab.rowconfigure(0, weight=1)
        hdr_tab.columnconfigure(0, weight=1)
        ttk.Label(hdr_tab, text="One header per line:  Key: Value",
                  style="Dim.TLabel").grid(row=0, column=0, sticky="w", pady=(0, 3))
        self._headers_text = self._make_text(hdr_tab, height=6)
        self._headers_text.grid(row=1, column=0, columnspan=2, sticky="nsew")
        hdr_tab.rowconfigure(1, weight=1)

        # Body tab
        body_tab = ttk.Frame(nb, padding=6)
        nb.add(body_tab, text="  Body  ")
        body_tab.rowconfigure(1, weight=1)
        body_tab.columnconfigure(0, weight=1)
        self._body_fmt_var = tk.StringVar(value="json")
        fmt_frame = ttk.Frame(body_tab)
        fmt_frame.grid(row=0, column=0, sticky="w", pady=(0, 3))
        ttk.Label(fmt_frame, text="Format hint:", style="Dim.TLabel").pack(
            side="left", padx=(0, 6))
        for fmt in ("json", "form", "raw"):
            ttk.Radiobutton(fmt_frame, text=fmt, variable=self._body_fmt_var,
                            value=fmt).pack(side="left", padx=3)
        self._body_text = self._make_text(body_tab, height=6)
        self._body_text.grid(row=1, column=0, columnspan=2, sticky="nsew")

        # Options tab
        opt_tab = ttk.Frame(nb, padding=10)
        nb.add(opt_tab, text="  Options  ")
        self._follow_var = tk.BooleanVar(value=True)
        self._insecure_var = tk.BooleanVar(value=False)
        self._verbose_var = tk.BooleanVar(value=False)
        self._timeout_var = tk.StringVar(value="30")
        ttk.Checkbutton(opt_tab, text="-L  Follow redirects",
                        variable=self._follow_var,
                        command=self._refresh_preview).grid(
            row=0, column=0, sticky="w", pady=3)
        ttk.Checkbutton(opt_tab, text="-k  Skip TLS verification",
                        variable=self._insecure_var,
                        command=self._refresh_preview).grid(
            row=1, column=0, sticky="w", pady=3)
        ttk.Checkbutton(opt_tab, text="-v  Verbose",
                        variable=self._verbose_var,
                        command=self._refresh_preview).grid(
            row=2, column=0, sticky="w", pady=3)
        timeout_row = ttk.Frame(opt_tab)
        timeout_row.grid(row=3, column=0, sticky="w", pady=3)
        ttk.Label(timeout_row, text="--max-time (s):").pack(side="left", padx=(0, 6))
        ttk.Entry(timeout_row, textvariable=self._timeout_var, width=6).pack(side="left")
        self._timeout_var.trace_add("write", lambda *_: self._refresh_preview())

        # ── response area ────────────────────────────────────────────────
        resp_outer = ttk.Frame(self, padding=(12, 6, 12, 12))
        resp_outer.grid(row=3, column=0, sticky="nsew")
        resp_outer.rowconfigure(1, weight=1)
        resp_outer.columnconfigure(0, weight=1)

        resp_hdr = ttk.Frame(resp_outer)
        resp_hdr.grid(row=0, column=0, sticky="ew")
        resp_hdr.columnconfigure(1, weight=1)

        ttk.Label(resp_hdr, text="RESPONSE", style="Title.TLabel").grid(
            row=0, column=0, sticky="w")
        self._status_var = tk.StringVar(value="")
        self._status_lbl = ttk.Label(resp_hdr, textvariable=self._status_var,
                                     style="Dim.TLabel")
        self._status_lbl.grid(row=0, column=1, sticky="w", padx=(10, 0))
        ttk.Button(resp_hdr, text="Clear", style="Copy.TButton",
                   command=lambda: self.set_response("")).grid(
            row=0, column=2, sticky="e")

        self._response_text = scrolledtext.ScrolledText(
            resp_outer,
            font=self.FONT_MONO,
            bg=self.BG_INPUT, fg=self.FG,
            insertbackground=self.ACCENT,
            selectbackground=self.ACCENT,
            selectforeground=self.BG,
            relief="flat",
            borderwidth=0,
            padx=8, pady=8,
            state="disabled",
            wrap="none",
        )
        self._response_text.grid(row=1, column=0, sticky="nsew", pady=(6, 0))

        # response horizontal scrollbar
        h_sb = ttk.Scrollbar(resp_outer, orient="horizontal",
                             command=self._response_text.xview)
        h_sb.grid(row=2, column=0, sticky="ew")
        self._response_text.configure(xscrollcommand=h_sb.set)

        # configure response text tags for syntax colouring
        for tag, colour in [
            ("status_ok", self.GREEN),
            ("status_err", self.RED),
            ("header_key", self.ACCENT),
            ("header_val", self.FG),
            ("sep", self.FG_DIM),
        ]:
            self._response_text.tag_configure(tag, foreground=colour)

    # ── helper: build a dark scrolled Text widget ────────────────────────

    def _make_text(self, parent: tk.Widget, height: int) -> tk.Text:
        frame = ttk.Frame(parent, style="Card.TFrame")
        frame.grid_propagate(True)

        widget = tk.Text(
            parent,
            font=self.FONT_MONO,
            bg=self.BG_INPUT, fg=self.FG,
            insertbackground=self.ACCENT,
            selectbackground=self.ACCENT,
            selectforeground=self.BG,
            relief="flat", borderwidth=0,
            padx=8, pady=6,
            height=height,
            undo=True,
            wrap="none",
        )
        vsb = ttk.Scrollbar(parent, orient="vertical", command=widget.yview)
        widget.configure(yscrollcommand=vsb.set)
        vsb.grid(row=1, column=1, sticky="ns")
        return widget

    # ── trace / event bindings ───────────────────────────────────────────

    def _bind_trace(self) -> None:
        self._method_var.trace_add("write", lambda *_: self._refresh_preview())
        self._url_var.trace_add("write", lambda *_: self._refresh_preview())
        self._headers_text.bind("<<Modified>>", self._on_text_modified)
        self._body_text.bind("<<Modified>>", self._on_text_modified)

    def _on_text_modified(self, _event: tk.Event) -> None:
        for w in (self._headers_text, self._body_text):
            w.edit_modified(False)
        self._refresh_preview()

    def _refresh_preview(self) -> None:
        self._presenter.on_params_changed(
            self._method_var.get(),
            self._url_var.get(),
            self._headers_text.get("1.0", "end-1c"),
            self._body_text.get("1.0", "end-1c"),
        )

    def _on_execute(self) -> None:
        self._presenter.on_execute(
            self._method_var.get(),
            self._url_var.get(),
            self._headers_text.get("1.0", "end-1c"),
            self._body_text.get("1.0", "end-1c"),
        )

    def _copy_preview(self) -> None:
        self.clipboard_clear()
        self.clipboard_append(self._preview_var.get())

    # ── View interface (called by Presenter) ─────────────────────────────

    def set_preview(self, text: str) -> None:
        self._preview_var.set(text)

    def set_response(self, text: str) -> None:
        self._response_text.configure(state="normal")
        self._response_text.delete("1.0", "end")
        if text:
            self._colour_response(text)
        self._response_text.configure(state="disabled")

    def _colour_response(self, text: str) -> None:
        """Simple syntax colouring for HTTP responses."""
        lines = text.splitlines(keepends=True)
        for i, line in enumerate(lines):
            if i == 0 and line.startswith("HTTP/"):
                colour = "status_ok" if " 2" in line else "status_err"
                self._response_text.insert("end", line, colour)
            elif ": " in line and not line.startswith(" "):
                key, _, rest = line.partition(": ")
                self._response_text.insert("end", key, "header_key")
                self._response_text.insert("end", ": " + rest, "header_val")
            elif line.strip() == "" and i > 0:
                self._response_text.insert("end", line, "sep")
            else:
                self._response_text.insert("end", line)

    def set_status(self, msg: str, kind: str = "ok") -> None:
        colour_map = {"ok": self.GREEN, "error": self.RED, "running": self.YELLOW}
        self._status_lbl.configure(foreground=colour_map.get(kind, self.FG_DIM))
        self._status_var.set(msg)

    def set_execute_state(self, disabled: bool) -> None:
        self._exec_btn.configure(state="disabled" if disabled else "normal")

    def after_safe(self, fn, *args) -> None:  # noqa: ANN001
        """Schedule a call on the Tk main thread from a worker thread."""
        self.after(0, fn, *args)

    # ── extra curl flags from Options tab ──────────────────────────────
    #    (presenter gets these through get_extra_flags called in build_argv)


# ─────────────────────────────────────────────
#  PATCHING: Options flags passed to model
# ─────────────────────────────────────────────

_orig_build = CurlModel.build_argv


def _patched_build(
    self,
    method: str,
    url: str,
    headers_text: str,
    body_text: str,
    *,
    follow: bool = True,
    insecure: bool = False,
    verbose: bool = False,
    timeout: str = "30",
) -> list[str]:
    argv = _orig_build(self, method, url, headers_text, body_text)
    if follow:
        argv.insert(1, "-L")
    if insecure:
        argv.insert(1, "-k")
    if verbose:
        # replace -s (silent) with -v
        if "-s" in argv:
            argv.remove("-s")
        argv.insert(1, "-v")
    t = timeout.strip()
    if t and t.isdigit():
        argv.insert(1, f"--max-time")
        argv.insert(2, t)
    return argv


CurlModel.build_argv = _patched_build  # type: ignore[method-assign]


# Patch presenter to pass option flags from view
_orig_params_changed = CurlPresenter.on_params_changed
_orig_execute = CurlPresenter.on_execute


def _patched_params_changed(
    self,
    method: str,
    url: str,
    headers: str,
    body: str,
) -> None:
    v = self._view
    extra = _get_extra(v)
    argv = self._model.build_argv(method, url, headers, body, **extra)
    preview = self._model.argv_to_display_string(argv)
    v.set_preview(preview)


def _patched_execute(
    self,
    method: str,
    url: str,
    headers: str,
    body: str,
) -> None:
    if not url.strip():
        messagebox.showwarning("Missing URL", "Please enter a request URL.")
        return
    if self._running:
        messagebox.showinfo("Busy", "A request is already in progress.")
        return

    v = self._view
    extra = _get_extra(v)
    argv = self._model.build_argv(method, url, headers, body, **extra)
    preview = self._model.argv_to_display_string(argv)
    v.set_preview(preview)
    v.set_response("")
    v.set_status("⏳  Running…", "running")
    v.set_execute_state(disabled=True)

    thread = threading.Thread(
        target=self._run_curl,
        args=(argv,),
        daemon=True,
    )
    thread.start()


def _get_extra(view: "CurlView") -> dict:
    try:
        return {
            "follow": view._follow_var.get(),
            "insecure": view._insecure_var.get(),
            "verbose": view._verbose_var.get(),
            "timeout": view._timeout_var.get(),
        }
    except AttributeError:
        return {}


CurlPresenter.on_params_changed = _patched_params_changed  # type: ignore[method-assign]
CurlPresenter.on_execute = _patched_execute  # type: ignore[method-assign]




if __name__ == "__main__":
    CurlApp().run()
