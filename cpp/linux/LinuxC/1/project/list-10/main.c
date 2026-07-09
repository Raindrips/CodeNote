/******************************************************************************
*
*  Copyright (C), 2001-2005, Huawei Tech. Co., Ltd.
*
*******************************************************************************
*  File Name     : main.c
*  Version       : Initial Draft
*  Author        : chandler
*  Created       : 2020/1/13
*  Last Modified :
*  Description   : main
*  Function List :
*
*       1.                main
*       2.                proxy_inuse_send
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
#include "./linklist.h"
#include "./tcp.h"
#include "./http.h"



/*==============================================*
 *      constants or macros define              *
 *----------------------------------------------*/


/*==============================================*
 *      project-wide global variables           *
 *----------------------------------------------*/
 void proxy_inuse_send(db_data_pt pdata);



/*==============================================*
 *      routines' or functions' implementations *
 *----------------------------------------------*/


int main(int argc ,char *argv[])
{
    db_list_pt iot_gate = proxy_list_create();
    init_proxy_tcp(iot_gate);
    init_proxy_http(iot_gate);
    init_proxy_http(iot_gate);
    init_proxy_https(iot_gate);
    proxy_list_cuid(iot_gate, proxy_inuse_send);
    proxy_list_delete(&iot_gate, 1);
    proxy_list_delete(&iot_gate, 1);
}


void proxy_inuse_send(db_data_pt pdata)
{
    int  ret=0;
    if(pdata->flag==INUSE)
    {
        pdata->Init(pdata);
        ret=pdata->SendFunction(pdata,"hello tanzhou\n");
        printf("Inuse type :%d send success\n",pdata->id);
    }
}
