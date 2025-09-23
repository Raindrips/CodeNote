using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RpgGame {
    class PlayerManager {
        string[] picArray = { @"res/role/r1.png", @"res/role/r2.png", @"res/role/r3.png" };

        private static PlayerManager instance;
        public static PlayerManager Instance {
            get {
                if (instance == null) {
                    instance = new PlayerManager();
                }
                return instance;
            }
        }
        public int CurrentPlayerID {
            get {
                return currentPlayerID;
            }
        }

        private int currentPlayerID;

        public void Create() {

        }
    }
}
