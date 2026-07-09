/******************************************************************************
*
*  Copyright (C), 2001-2005, Huawei Tech. Co., Ltd.
*
*******************************************************************************
*  File Name     : linklist.h
*  Version       : Initial Draft
*  Author        : chandler
*  Created       : 2020/1/13
*  Last Modified :
*  Description   : linklist.c header file
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
#ifndef __LINKLIST_H__
#define __LINKLIST_H__


#ifdef __cplusplus
#if __cplusplus
extern "C"{
#endif
#endif /* __cplusplus */


/*==============================================*
 *      include header files                    *
 *----------------------------------------------*/
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>


/*==============================================*
 *      constants or macros define              *
 *----------------------------------------------*/   
#define HTTP   1
#define TCP    2
#define UDP    3
#define UART   4

#define INUSE   1
#define UNUSE   0


/*==============================================*
 *      project-wide global variables           *
 *----------------------------------------------*/
    
typedef unsigned int   u32;
typedef unsigned char  u8;
typedef unsigned short u16;


typedef struct db_data
{
    u8   id;
    u8   flag;
    int  sock_fd;
    u8    * send_buffer;
    u32  (* Init)(struct db_data *pdata);
    int  (* SendFunction)(struct db_data *pdata,void *sendbuffer);
}db_data_t;
typedef db_data_t * db_data_pt;

typedef struct db_node
{
    void *           data;
    struct db_node * prev;
    struct db_node * next;
}db_node_t;
typedef db_node_t * db_node_pt; 


typedef struct db_list
{
    u32  limit_size;
    db_node_pt head;
    db_node_pt tail;
}db_list_t;
typedef db_list_t * db_list_pt ;

extern int errno;

/*==============================================*
 *      routines' or functions' implementations *
 *----------------------------------------------*/

extern db_list_pt proxy_list_create( void );
extern void proxy_list_cuid( db_list_t  * list_head, void (*do_function)(void *) );
extern int proxy_list_delete(db_list_t **list_head, int num );
extern int proxy_list_insert_after(db_list_t ** list_head, int num, void * new_node_data );
extern int proxy_list_insert_before( db_list_t ** list_head, int num, void * new_node_data );
extern int proxy_list_modify( db_list_t ** list_head, int num, void *new_node_data );
extern int proxy_list_search( db_list_t ** list_head, void * find_data, int(* compare)(void *,void*) );
static inline void * __proxy_list_visit(db_list_t **list_head ,u32 num );

#ifdef __cplusplus
#if __cplusplus
}
#endif
#endif /* __cplusplus */


#endif /* __LINKLIST_H__ */
