using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace RpgGame {
   
    public partial class Form1 : Form {
        const string ROLE = @"res/role/r1.png";
        const string ROLE2 = @"res/role/r2.png";
        const string ROLE3 = @"res/role/r3.png";



        int x = 50, y = 50;
        int face = 1;
        int animation_ctrl = 0;
        public Player player;
        public Player[] playerGroup;

        public Bitmap mc_nomal;
        public Bitmap mc_event;

        public Form1() {
            InitializeComponent();

            player = new Player();
        }

        //设置光标
        public void SetCurse() {
            mc_nomal = new Bitmap(@"res/ui/mc_1.png");
            mc_nomal.SetResolution(96, 96);
            mc_event = new Bitmap(@"res/ui/mc_2.png");
            mc_nomal.SetResolution(96, 96);
        }

        private void Form1_Load(object sender, EventArgs e) {
            //Draw();
            SetCurse();
        }

        //private void draw_mouse(Graphics g) {
        //    Point showpoint = stage.PointToClient(Cursor.Position);
        //    showpoint.X = (int)(showpoint.X * (resolutionX + 0.0) / stage.Width);
        //    showpoint.Y = (int)(showpoint.Y * (resolutionY + 0.0) / stage.Height);
        //    if (mc_mod == 0)
        //        g.DrawImage(mc_nomal, showpoint.X, showpoint.Y);
        //    else
        //        g.DrawImage(mc_event, showpoint.X, showpoint.Y);
        //}

        private void Draw() {
            //DrawImage();
            DrawTest2();
        }



        private void pictureBox1_Click(object sender, EventArgs e) {

        }

        public void DrawImage() {
            Bitmap bitmap = new Bitmap(ROLE);//向上的图片
            bitmap.SetResolution(96, 96);

            //创建在pictureBox1上的图像g1
            Graphics g1 = pictureBox1.CreateGraphics();
            // 将图像画在内存上，并使g为pictureBox1上的图像
            BufferedGraphicsContext currentContext = BufferedGraphicsManager.Current;
            BufferedGraphics myBuffer = currentContext.Allocate(g1, this.DisplayRectangle);
            Graphics g = myBuffer.Graphics;
            animation_ctrl = animation_ctrl + 1;
            Rectangle crazycoderRgl = new Rectangle(bitmap.Width / 4 * (animation_ctrl % 4), bitmap.Height / 4 * (face - 1), bitmap.Width / 4, bitmap.Height / 4);//定义区域
            Bitmap bitmap0 = bitmap.Clone(crazycoderRgl, bitmap.PixelFormat);//复制小图
            g.DrawImage(bitmap0, x, y);

            // 显示图像并释放资源
            myBuffer.Render();
            myBuffer.Dispose();
        }

        void DrawTest2() {
            Bitmap bitmap = new Bitmap(ROLE);
            bitmap.SetResolution(96, 96);

            Graphics g1 = pictureBox1.CreateGraphics();
            BufferedGraphicsContext currentContext = BufferedGraphicsManager.Current;
            BufferedGraphics myBuffer = currentContext.Allocate(g1, DisplayRectangle);
            Graphics g0 = myBuffer.Graphics;

            //Bitmap bit = SplieSprite(bitmap, 4, 1, 1);
            //g0.DrawImage(bit, x, y);
            player.Draw(g0);

            myBuffer.Render();
            myBuffer.Dispose();

        }

        Bitmap SplieSprite(Bitmap bitmap, int size, int x, int y) {
            int width = bitmap.Width / size;
            int height = bitmap.Height / size;

            Rectangle crazycoder = new Rectangle(
                width * x,
                height  * y,
                width,
                height );
            Bitmap b0 = bitmap.Clone(crazycoder, bitmap.PixelFormat);
            return b0;
        }

        private void Form1_KeyUp(object sender, KeyEventArgs e) {
            if (e.KeyCode == Keys.Tab) {

            }
            player.KeyControlUp(e);
            Draw();
        }

        private void Form1_KeyDown(object sender, KeyEventArgs e) {
            player.KeyControlDown(e);
            Draw();
        }
    }
}
