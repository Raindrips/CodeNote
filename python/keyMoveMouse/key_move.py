import pyautogui
import time
import keyboard
import math
                                                        

class KeyMove:
  x=0
  y=0
  width=0
  height=0
  dt=0.01
  
  _speed=0
  
  speed=3
  fastSpeed=5
  
  def init(self):
    pyautogui.FAILSAFE=False
    self.width,self.height=pyautogui.size()
    self.x,self.y=pyautogui.position()
    
    pyautogui.moveTo(self.x,self.y)
    self.start_update()
    
  def start_update(self):
    while True:
      self.update()
    
  def update(self):
    if keyboard.is_pressed('shift'):
      self._speed=self.fastSpeed
    else:
      self._speed=self.speed
      
    self.check('up',self.up)
    self.check('right',self.right)
    self.check('down',self.down)
    self.check('left',self.left)
    self.check('z',self.click)
    self.check('esc',self.exit)
    self.set_curse()
    time.sleep(self.dt)
  
  def set_curse(self):
    # print(self.x,self.y)
    pyautogui.moveTo(self.x,self.y,_pause=False)
    
          
  def check(self,key_name,call):
    if keyboard.is_pressed(key_name):
      call()
    

  def exit(self):
    exit()

  def up(self):
    self.y-=self._speed

  def right(self):
    self.x+=self._speed

  def down(self):
      self.y+=self._speed

  def left(self):
    self.x-=self._speed
    
  def click(self):
    pyautogui.leftClick()
    

def main():
  key= KeyMove()
  key.init()

main()