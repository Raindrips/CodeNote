#include "Command.h"
#include "MyCom.h"
#include <vector>

class GameActor{
public:
	std::vector<Command*> cmds;
	void doCommand(Command* cmd);

	void replay();
};