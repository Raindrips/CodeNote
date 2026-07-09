/******************************************************************************
*
*  Copyright (C), 2001-2005, Huawei Tech. Co., Ltd.
*
*******************************************************************************
*  File Name     : tcp.c
*  Version       : Initial Draft
*  Author        : chandler
*  Created       : 2020/1/13
*  Last Modified :
*  Description   : Tcp proxy 
*  Function List :
*
*       1.                init_proxy_tcp
*       2.                init_tcp_proxy_node
*       3.                register_tcp_proxy_method
*       4.                tcp_proxy_send
*
*  History:
* 
*       1.  Date         : 2020/1/13
*           Author       : chandler
*           Modification : Created file
*
******************************************************************************/

/*==============================================*
 *      include header files                    *
 *----------------------------------------------*/
#include "./tcp.h"



/*==============================================*
 *      constants or macros define              *
 *----------------------------------------------*/


/*==============================================*
 *      project-wide global variables           *
 *----------------------------------------------*/



/*==============================================*
 *      routines' or functions' implementations *
 *----------------------------------------------*/



/*****************************************************************************
*   Prototype    : init_tcp_proxy_node
*   Description  : Init tcp type proxy
*   Input        : db_data_pt pdata  
*   Output       : None
*   Return Value : static int
*   Calls        : 
*   Called By    : 
*
*   History:
* 
*       1.  Date         : 2020/1/13
*           Author       : chandler
*           Modification : Created function
*
*****************************************************************************/
static int init_tcp_proxy_node(db_data_pt pdata)
{
    if((pdata->sock_fd=socket(AF_INET,SOCK_STREAM,0))<0)
    {
        perror("socker create error!\n");
    }
    struct sockaddr_in servaddr;
    bzero(&servaddr,sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port   = htons(TCP_PORT);
    if(inet_pton(AF_INET,TCP_SERVER,&servaddr.sin_addr)<=0)
        perror("inet_pton error\n");
    if(connect(pdata->sock_fd,(struct sockaddr*)&servaddr,sizeof(servaddr))<0)
        perror("connect error\n");
}

/*****************************************************************************
*   Prototype    : tcp_proxy_send
*   Description  : proxy tcp send
*   Input        : db_data_pt pdata   
*                  void * sendbuffer  
*   Output       : None
*   Return Value : static int
*   Calls        : 
*   Called By    : 
*
*   History:
* 
*       1.  Date         : 2020/1/13
*           Author       : chandler
*           Modification : Created function
*
*****************************************************************************/
static int tcp_proxy_send(db_data_pt pdata,void * sendbuffer)
{
    int ret = write(pdata->sock_fd,sendbuffer,4096);
    if(ret<0)
          perror("write error\n");
    else
          printf("Send Success,send length:%d\n",ret);
     return ret;
}


static db_data_t tcp_proxy_node ={
    .id = TCP ,
    .flag = INUSE,
    .Init = init_tcp_proxy_node,
    .SendFunction = tcp_proxy_send,
};

/*****************************************************************************
*   Prototype    : register_tcp_proxy_method
*   Description  : To register tcp proxy for proxy level
*   Input        : db_list_pt ptlist  
*                  void *pdata        
*   Output       : None
*   Return Value : static void
*   Calls        : 
*   Called By    : 
*
*   History:
* 
*       1.  Date         : 2020/1/13
*           Author       : chandler
*           Modification : Created function
*
*****************************************************************************/
static void register_tcp_proxy_method(db_list_pt ptlist,void *pdata)
{
    if(ptlist==NULL || pdata==NULL)
    {
       errno =EINVAL;
       return ;
    }
    proxy_list_insert_before(&ptlist,0, pdata);
}

/*****************************************************************************
*   Prototype    : init_proxy_tcp
*   Description  : Tcp proxy init
*   Input        : db_list_pt ptlist  
*   Output       : None
*   Return Value : void
*   Calls        : 
*   Called By    : 
*
*   History:
* 
*       1.  Date         : 2020/1/13
*           Author       : chandler
*           Modification : Created function
*
*****************************************************************************/
void init_proxy_tcp(db_list_pt ptlist)
{
    register_tcp_proxy_method(ptlist,(void *)&tcp_proxy_node);
}
