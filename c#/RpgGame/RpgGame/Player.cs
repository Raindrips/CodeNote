using System;
using System.Drawing;
using System.Windows.Forms;

namespace RpgGame {

    public class Player {
        string[] picArray = { @"res/role/r1.png", @"res/role/r2.png", @"res/role/r3.png" };
        string MOVE_FLAG = @"res/ui/move_flag.png";

        public enum Status {
            Walk = 1,
            Panel,
            Task,
            Fight,
        }

        public enum Face {
            Up = 3, Right = 2, Down = 0, Left = 1
        }

        //行走坐标
        public int x = 0;
        public int y = 0;
        public int playerId = 0;      //当前角色ID      
        public Face face = Face.Up;
        public int frameStep = 0;
        public int speed = 4;

        //是否激活
        public bool isActive = false;
        private long walkTime = 0;
        public long walkInterval = 100;

        //图像
        public Bitmap bitmap;
        private Bitmap[] bitmapArray;
        public Bitmap moveFlag;
        public Player() {
            bitmapArray = new Bitmap[picArray.Length];
            for (int i = 0; i < bitmapArray.Length; i++) {
                bitmapArray[i] = new Bitmap(picArray[i]);
                bitmapArray[i].SetResolution(128, 128);
            }
            playerId = 0;
            moveFlag = new Bitmap(MOVE_FLAG);
            moveFlag.SetResolution(96, 96);
            this.bitmap = bitmapArray[playerId];
        }

        public void KeyControlDown(KeyEventArgs e) {
            Face oldFace = face;
            switch (e.KeyCode) {
                case Keys.Up:
                    face = Face.Up;
                    y -= speed;
                    break;
                case Keys.Down:
                    face = Face.Down;
                    y += speed;
                    break;
                case Keys.Left:
                    x -= speed;
                    face = Face.Left;
                    break;
                case Keys.Right:
                    x += speed;
                    face = Face.Right;
                    break;
                case Keys.Tab:
                    ChangePlayer();
                    return;
                default:
                    return;
            }

            if (Detla() - walkTime <= walkInterval) {
                return;
            }
            frameStep++;
            walkTime = Detla();

        }

        public void KeyControlUp(KeyEventArgs e) {
            frameStep = 0;
            walkTime = 0;
            
        }

        public void ChangePlayer() {
            playerId = (playerId + 1) % picArray.Length;
            bitmap = bitmapArray[playerId];
        }


        public void Draw(Graphics g) {
            int size = 4;
            Bitmap b0 = SplieSprite(bitmap, size, (frameStep % size), (int)face);
            g.DrawImage(b0, x, y);
        }

        Bitmap SplieSprite(Bitmap bitmap, int size, int x, int y) {
            int width = bitmap.Width / size;
            int height = bitmap.Height / size;

            Rectangle crazycoder = new Rectangle(
                width * x,
                height * y,
                width,
                height);
            Bitmap b0 = bitmap.Clone(crazycoder, bitmap.PixelFormat);
            return b0;
        }

        private long Detla() {
            DateTime dt1 = new DateTime(1970, 1, 1);
            TimeSpan ts = DateTime.Now - dt1;
            return (long)ts.TotalMilliseconds;
        }
    }


}
