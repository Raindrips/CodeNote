import { SimpleEvent } from './SimpleEvent';

function test1() {
    // 定义事件映射
    type Events = {
        login: { user: string };
        logout: void;
    };
    // 使用示例
    class AuthService {
        // 类似 C# 的 event 声明
        public readonly login = new SimpleEvent<Events['login']>();
        public readonly logout = new SimpleEvent<Events['logout']>();

        doLogin(user: string) {
            this.login.invoke({ user });
        }

        doLogout() {
            this.logout.invoke(undefined);
        }
    }

    // 测试
    const auth = new AuthService();

    auth.login.add((e) => console.log(`User ${e.user} logged in`));
    auth.logout.add(() => console.log('User logged out'));

    auth.doLogin('Alice');
    auth.doLogout();
}

function test2() {
    type LoginData = { id: number; message: string };
    const event = new SimpleEvent<LoginData>();

    const LogFn = (data: LoginData) => {
        console.log('log:', data);
    };
    const WarnFn = (data: LoginData) => {
        console.warn('warn:', data);
    };
    event.add(LogFn);
    event.add(WarnFn);

    event.invoke({ id: 1, message: 'hello wold' });
    event.invoke({ id: 1, message: 'say good bye' });

    event.remove(LogFn);
    event.remove(WarnFn);
    console.log('remove');
    event.invoke({ id: 1, message: 'hello wold' });
}

// test1();
test2();
