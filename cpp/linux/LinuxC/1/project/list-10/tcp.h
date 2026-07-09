/******************************************************************************
*
*  Copyright (C), 2001-2005, Huawei Tech. Co., Ltd.
*
*******************************************************************************
*  File Name     : tcp.h
*  Version       : Initial Draft
*  Author        : chandler
*  Created       : 2020/1/13
*  Last Modified :
*  Description   : tcp.c header file
*  Function List :
*
*
*  History:
* 
*       1.  Date         : 2020/1/13
*           Author       : chandler
*           Modification : Created file
*
******************************************************************************/
#ifndef __TCP_H__
#define __TCP_H__


#ifdef __cplusplus
#if __cplusplus
extern "C"{
#endif
#endif /* __cplusplus */


/*==============================================*
 *      include header files                    *
 *----------------------------------------------*/
#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <time.h>
#include <errno.h>
#include <signal.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/time.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include "linklist.h"
#include <stdlib.h>




/*==============================================*
 *      constants or macros define              *
 *----------------------------------------------*/
#define TCP_PORT 8888
#define TCP_SERVER  "127.0.0.1"


/*==============================================*
 *      project-wide global variables           *
 *----------------------------------------------*/



/*==============================================*
 *      routines' or functions' implementations *
 *----------------------------------------------*/

extern void init_proxy_tcp(db_list_pt ptlist);
static int init_tcp_proxy_node(db_data_pt pdata);
static void register_tcp_proxy_method(db_list_pt ptlist,void *pdata);
static int tcp_proxy_send(db_data_pt pdata,void * sendbuffer);

#ifdef __cplusplus
#if __cplusplus
}
#endif
#endif /* __cplusplus */


#endif /* __TCP_H__ */
