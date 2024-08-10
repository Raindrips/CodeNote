
#include<iostream>
#include<string>
#include<algorithm>
using namespace std;
void func(string s) {
    constexpr size_t LEN = 11;
    int arr[LEN], cnt = 0;
    std::fill(arr, arr + LEN, -1);
    if (s[0] == '1') {
        arr[2] *= -1; arr[4] *= -1;
    }
    if (s[1] == '1') {
        arr[1] *= -1; arr[3] *= -1; arr[5] *= -1;
    }
    if (s[2] == '1') {
        arr[2] *= -1; arr[6] *= -1;
    }
    if (s[3] == '1') {
        arr[1] *= -1; arr[5] *= -1; arr[7] *= -1;
    }
    if (s[4] == '1') {
        arr[2] *= -1; arr[4] *= -1; arr[6] *= -1; arr[8] *= -1;
    }
    if (s[5] == '1') {
        arr[3] *= -1; arr[5] *= -1; arr[9] *= -1;
    }
    if (s[6] == '1') {
        arr[4] *= -1; arr[8] *= -1;
    }
    if (s[7] == '1') {
        arr[5] *= -1; arr[7] *= -1; arr[9] *= -1;
    }
    if (s[8] == '1') {
        arr[6] *= -1; arr[8] *= -1;
    }
    for (int i = 1; i <= 9; i++) {
        if (arr[i] == 1) {
            cnt++;
        }
    }
    if (cnt == 4) {
        cout << s << endl;
    }
    return;
}
int main() {
    for (int i = 0; i <= 511; i++) {
        int tem = i;
        string s = "";
        while (tem) {
            s = (char)(tem % 2 + '0') + s;
            tem = tem / 2;
        }
        string b(9 - s.length(), '0');
        s = b + s;
        func(s);
    }
    return 0;
}
