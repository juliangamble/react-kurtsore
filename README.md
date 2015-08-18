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

The `CursorPropsMixin` mixin implements an efficient `shouldComponentUpdate` for react components
that receive cursors in their props. It is similar to [react.addons.PureRenderMixin](http://facebook.github.io/react/docs/pure-render-mixin.html)
in that it assumes that the same non-cursor props and state shouldn't trigger a re-render.

Apart from state and non-cursor prop checks, it will return true iff the snapshots of the cursor
props are different. You just need to add it as a mixin in your components that receive cursors
as props:

```javascript
var k = require("kurtsore"),
    React = require("react"),
    rk = require("react-kurtsore");

var Hello = React.createClass({
    propTypes: {
        user: React.PropTypes.instanceOf(k.Cursor)
    },

    mixins: [ rk.CursorPropsMixin ],

    render: {
        var user = this.props.user.deref();
        return <h1>Hello, {user}</h1>
    }
});
```

## Making this work on OS X (in case you have the latest version of node)

Install nvm
```
$ brew install nvm
```

Add nvm to your profile
```
$ echo "source $(brew --prefix nvm)/nvm.sh" >> ~/.profile

$ source ~/.profile

$ nvm -v
```

Install node 0.10 (when latest is 0.12)
```
$ nvm install 0.10

$ nvm use 0.10
```

Update your project
```
$ npm rebuild

$ npm install
```

## License

BSD 2-clause license, Copyright 2015 Alejandro Gómez.
