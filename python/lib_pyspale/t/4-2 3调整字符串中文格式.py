import os,stat

str_file=os.listdir('.')
print(str_file)

str_list=['132.c','456.py','m_777.c','m_666.java']

for str in str_list:
	a=str.startswith('m_')
	b=str.endswith('.c');
	print(a,b)
	
