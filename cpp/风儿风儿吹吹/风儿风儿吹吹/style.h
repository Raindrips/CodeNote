#ifndef _TOOLS_H_
#define _TOOLS_H_
#include<easyx.h>

void SetWindowNewStyle(int w, int h);

//png透明贴图
void drawImg(IMAGE* pimg, int x, int y);
//去掉窗口标题以后，能够点击移动窗口
void mouseEvent();

#endif // !_TOOLS_H_

