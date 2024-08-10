#include <iostream>
using namespace std;

//插入字符串
int strins(char* str, int l, char ch) {
	int i = strlen(str)+1;
	str[i+1] = '\0';
	while (i > l)
	{
		str[i] = str[i - 1];
		i--;
	}
	str[i] = ch;
	return 0;
}

void append(char* str, int ch) {
	int len = strlen(str);
	str[len] = ch;
	str[len + 1] = '\0';
}

int handle(char buffer[],int length) {
	int count = 0;
	while (true) {
		
		char temp[BUFSIZ] = {0};
		int i = 0, j = 1;
		
		for (; j < length; j++) {
			if (buffer[i] != buffer[j]) {
				//temp += (buffer[i]);
				append(temp, buffer[i]);
			}
			else {
				while (j < length
					&& buffer[i] == buffer[j])
					j++;
			}
			i = j;
		}
		if (j == length) {
			append(temp, buffer[i]);
		}
		//cout << strlen(temp);
		if (strlen(temp) == length) {
			count = strlen(temp);
			break;
		}
		buffer = temp;
		length = strlen(temp);
	}
	return count;
}




int main(void) {
	int n;
	cin >> n;
	for (int i = 0; i < n; i++) {
		char buffer[BUFSIZ] = { 0 };
		cin >> buffer;
		int min = strlen(buffer);
		for (int j = 0; j < strlen(buffer); j++) {
			for (char ch = 'A'; ch <= 'C'; ch++) {
				char temp[BUFSIZ]= { 0 };
				strcpy_s(temp,buffer);
				strins(temp, j, ch);
				
				int count = handle(temp,strlen(temp));
				min = min > count ? count : min;
			}
		}
		cout << (strlen(buffer) + 1 - min) << endl;
	}
}
