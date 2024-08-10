#include <iostream>
#include <string>
using namespace std;

int handle(string buffer) {
	int count = 0;
	while (true) {
		string temp;
		int i = 0, j = 1;
		for (; j < buffer.length(); j++) {
			if (buffer[i] != buffer[j]) {
				temp += (buffer[i]);
			}
			else {
				while (j < buffer.length()
					&& buffer[i] == buffer[j])
					j++;
			}
			i = j;
		}
		if (j == buffer.length()) {
			temp += (buffer[i]);
		}
		if (temp.length() == buffer.length()) {
			count = temp.length();
			break;
		}
		buffer = temp;
	}
	return count;
}

int main(void) {
	int n;
	cin >> n;
	for (int i = 0; i < n; i++) {
		string buffer;
		cin >> buffer;
		int min = buffer.length();
		for (int j = 0; j < buffer.length(); j++) {
			for (char ch = 'A'; ch <= 'C'; ch++) {
				string temp = buffer;
				temp.insert(temp.begin()+j, ch);
				int count = handle(temp);
				min = min > count ? count : min;
			}
		}
		cout << (buffer.length() + 1 - min) << endl;
	}
}
