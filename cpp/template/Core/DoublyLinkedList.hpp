#pragma once

#include <cstddef>
#include <iterator>
#include <utility>

template <typename T>
class DoublyLinkedList {
private:
    struct Node {
        T value;
        Node* prev;
        Node* next;

        Node(const T& v) : value(v), prev(nullptr), next(nullptr) {}
        Node(T&& v) : value(std::move(v)), prev(nullptr), next(nullptr) {}
    };

    Node* head = nullptr;
    Node* tail = nullptr;
    std::size_t count = 0;

public:

    class iterator {
        Node* ptr;
    public:
        using iterator_category = std::bidirectional_iterator_tag;
        using value_type = T;
        using difference_type = std::ptrdiff_t;
        using pointer = T*;
        using reference = T&;

        iterator(Node* p = nullptr) : ptr(p) {}

        reference operator*() const { return ptr->value; }
        pointer operator->() const { return &ptr->value; }

        iterator& operator++() { ptr = ptr->next; return *this; }
        iterator operator++(int) { auto tmp = *this; ++(*this); return tmp; }

        iterator& operator--() { ptr = ptr->prev; return *this; }
        iterator operator--(int) { auto tmp = *this; --(*this); return tmp; }

        bool operator==(const iterator& other) const { return ptr == other.ptr; }
        bool operator!=(const iterator& other) const { return ptr != other.ptr; }

        Node* getNode() const { return ptr; }
    };

    DoublyLinkedList() = default;

    ~DoublyLinkedList() {
        clear();
    }

    //DoublyLinkedList(const DoublyLinkedList& other) {

    //    for (const auto& v : other)
    //        push_back(v);
    //}

    //DoublyLinkedList& operator=(const DoublyLinkedList& other) {

    //    if (this != &other) {
    //        clear();
    //        for (const auto& v : other)
    //            push_back(v);
    //    }
    //    return *this;
    //}

    DoublyLinkedList(DoublyLinkedList&& other) noexcept
        : head(other.head), tail(other.tail), count(other.count) {
        other.head = other.tail = nullptr;
        other.count = 0;
    }

    DoublyLinkedList& operator=(DoublyLinkedList&& other) noexcept {
        if (this != &other) {
            clear();
            head = other.head;
            tail = other.tail;
            count = other.count;
            other.head = other.tail = nullptr;
            other.count = 0;
        }
        return *this;
    }

    bool empty() const { return count == 0; }
    std::size_t size() const { return count; }

    iterator begin() { return iterator(head); }
    iterator end() { return iterator(nullptr); }

 
    void push_front(const T& value) {
        Node* n = new Node(value);
        n->next = head;
        if (head) head->prev = n;
        head = n;
        if (!tail) tail = n;
        ++count;
    }

    void push_front(T&& value) {
        Node* n = new Node(std::move(value));
        n->next = head;
        if (head) head->prev = n;
        head = n;
        if (!tail) tail = n;
        ++count;
    }

    void push_back(const T& value) {
        Node* n = new Node(value);
        n->prev = tail;
        if (tail) tail->next = n;
        tail = n;
        if (!head) head = n;
        ++count;
    }

    void push_back(T&& value) {
        Node* n = new Node(std::move(value));
        n->prev = tail;
        if (tail) tail->next = n;
        tail = n;
        if (!head) head = n;
        ++count;
    }

    void pop_front() {
        if (!head) return;
        Node* tmp = head;
        head = head->next;
        if (head) head->prev = nullptr;
        else tail = nullptr;
        delete tmp;
        --count;
    }

    void pop_back() {
        if (!tail) return;
        Node* tmp = tail;
        tail = tail->prev;
        if (tail) tail->next = nullptr;
        else head = nullptr;
        delete tmp;
        --count;
    }

    // ============================
    // Insert / Erase
    // ============================
    iterator insert(iterator pos, const T& value) {
        if (pos.getNode() == nullptr) {
            push_back(value);
            return iterator(tail);
        }

        Node* cur = pos.getNode();
        Node* n = new Node(value);

        n->prev = cur->prev;
        n->next = cur;

        if (cur->prev) cur->prev->next = n;
        else head = n;

        cur->prev = n;
        ++count;
        return iterator(n);
    }

    iterator erase(iterator pos) {
        Node* cur = pos.getNode();
        if (!cur) return end();

        Node* next = cur->next;

        if (cur->prev) cur->prev->next = cur->next;
        else head = cur->next;

        if (cur->next) cur->next->prev = cur->prev;
        else tail = cur->prev;

        delete cur;
        --count;
        return iterator(next);
    }

    void clear() {
        Node* cur = head;
        while (cur) {
            Node* nxt = cur->next;
            delete cur;
            cur = nxt;
        }
        head = tail = nullptr;
        count = 0;
    }
};
