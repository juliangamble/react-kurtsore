# react-kurtsore

[![Travis Badge](https://img.shields.io/travis/dialelo/react-kurtsore.svg?style=flat)](https://travis-ci.org/dialelo/react-kurtsore "Travis Badge")

This library is a collection of mixins for managing component state with [kurtsore](https://github.com/dialelo/kurtsore)
cursors.

## Installation

```
$ npm install react-kurtsore
```

## Usage

### CursorPropsMixin

The `CursorPropsMixin` mixin implements a efficient `shouldComponentUpdate` for react components
that receive cursors in their props. It is similar to [react.addons.PureRenderMixin](http://facebook.github.io/react/docs/pure-render-mixin.html)
in that it assumes that the same non-cursor props and state shouldn't trigger a re-render.

Apart from state and non-cursor prop checks, it will return true iff the snapshot of the cursor
props are different. You just need to add it as a mixin in your components that receive cursors
as props:

```javascript
var k = require("kurtsore"),
    React = require("react"),
    rk = require("react-kurtsore");

var Hello = React.createClass({
    propTypes: {
        user: React.PropTypes.instanceOf(k.Cursor)
    }

    mixins: [ rk.CursorPropsMixin ],

    render: {
        var user = this.props.user.deref();
        return <h1>Hello, {user}</h1>
    }
});
```

## License

BSD 2-clause license, Copyright 2015 Alejandro Gómez.
