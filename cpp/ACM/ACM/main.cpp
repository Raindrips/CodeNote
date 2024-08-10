#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <string>

using namespace std;


/*
typedef struct course
{
	char c_type;
	int c_num;
	string c_name;
	string c_syllabus;
	string c_lesson;
	string c_descrip;
	int c_num_seats;

	struct course* next;//Á´±í´æ
};
*/

typedef struct logging
{
	char p_type;//1==student,2==instructor
	string p_name;
	string p_password;

	struct logging* p_next;
}LOG,*PLOG;

/*
enum studchoice
{
	LOGIN=0,LISTALL,SELECE,LISTMINE,DESELECT,EXIT
};

enum instructorchoice
{
	ILISTALL=0,IADD,IREMOVE,IEXIT
};*/

void init(PLOG loginfo);
char logcheck(PLOG loginfo);


int main()
{
	PLOG loginfo=NULL;
	init(loginfo);
	cout<<logcheck(loginfo)<<endl;


	getchar();

	return 0;

}


void init(PLOG loginfo)
{
	loginfo=new LOG ;
	loginfo->p_type=1;
	loginfo->p_name="test";
	loginfo->p_password="123456";
	loginfo->p_next=NULL;

	PLOG next=new LOG;
	loginfo->p_next=next;
	next->p_next=NULL;
	next->p_type=2;
	next->p_name="instructor";
	next->p_password="123abc";
}

char logcheck(PLOG loginfo)//µÇÂ¼ÑéÖ¤
{
	LOG temp;
	PLOG ptemp=loginfo;
	char flag=1;

	while (1)
	{
		cout<<">name:"<<endl;
		cin>>temp.p_name;
		cout<<"credential:"<<endl;
		cin>>temp.p_password;

		while( (temp.p_name==ptemp->p_name) && (temp.p_password==ptemp->p_password) )
		{
			if (ptemp->p_next==NULL)
			{
				cout<<"invalid."<<endl<<"try again."<<endl;
				flag=0;
				break;
			}
			ptemp=ptemp->p_next;
		}

		if (flag)
		{
			if (ptemp->p_type==1)
			{
				cout<<"sucessful."<<endl<<"welcome test.done."<<endl;
			}
			if (ptemp->p_type==2)
			{
				cout<<"sucessful."<<endl<<"welcome instructor."<<endl;
			}
			break;
		}

	}


	return ptemp->p_type;
}

