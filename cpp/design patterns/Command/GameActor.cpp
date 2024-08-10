#include "GameActor.h"
using namespace std;
void GameActor::doCommand(Command* cmd)
{
	cmd->execute();
	cmds.push_back(cmd);
}

void GameActor::replay()
{
	for (auto& c : cmds) {
		c->execute();
	}
}
