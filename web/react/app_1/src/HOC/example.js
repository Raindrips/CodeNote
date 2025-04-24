
import { RouterContext } from 'react-router'; // Import RouterContext from the appropriate library
import hoistStatics from 'hoist-non-react-statics'; // Import hoistStatics from the hoist-non-react-statics library

function withRouter(Component)
{
    const displayName = `withRouter ${Component.displayName || Component.name}`;
    const C = props =>
    {
        const { WrappedComponentRef, ...remainingProps } = props;

        return (
            <RouterContext.Consumer>
                {
                    context => { <Component {...remainingProps} {...context.router} ref={WrappedComponentRef} /> }
                };

            </RouterContext.Consumer>
        )
    }
    C.displayName = displayName;
    C.WrappedComponent = Component;
    return hoistStatics(C, Component)
}

export default withRouter;