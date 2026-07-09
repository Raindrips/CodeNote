#ifndef __LCD_H__
#define __LCD_H_
#define LCD_WIDTH 800
#define LCD_HEIGHT 480
#define LCD_BYTESPERPIXEL   4  //每个像素点占几个字节
extern void lcd_draw_rectangle(int x0, int y0, int w, int h, int color);
extern void lcd_draw_triangle(int y1,int y2,int x,int w,int mod,int color);
extern void lcd_draw_circle(int x0,int y0,int r,int color);
extern void lcd_draw_diamonds(int x0,int y0,int size,int color);
extern void lcd_draw_spade(int x0,int y0,int size,int color);//画黑桃
extern void lcd_draw_hearts(int x0,int y0,int size,int color);//画红桃
extern void lcd_draw_club(int x0,int y0,int size,int color);//画梅花
extern void lcd_draw_words(int x,int y,int color,char *w);
#endif