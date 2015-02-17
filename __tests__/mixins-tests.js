jest.dontMock("../react-kurtsore");

var a = require("atomo"),
    k = require("kurtsore"),
    i = require("immutable"),
    React = require("react/addons"),
    _ = require("lodash"),
    TestUtils = React.addons.TestUtils,
    Simulate = TestUtils.Simulate,
    rk = require("../react-kurtsore");

var data = i.fromJS({text: "Hello", anotherText: "Bye"}),
    // state
    atom = a.atom(data),
    // children components
    textChildDidUpdate = jest.genMockFunction(),
    TextView = React.createClass({
        mixins: [ rk.CursorPropsMixin ],

        render: function(){
            var text = this.props.text.deref();
            return React.createElement("p", {}, text);
        },

        componentDidUpdate: textChildDidUpdate
    }),
    anotherTextChildDidUpdate = jest.genMockFunction(),
    AnotherTextView = React.createClass({
        mixins: [ rk.CursorPropsMixin ],

        render: function(){
            var anotherText = this.props.anotherText.deref();
            return React.createElement("p", {}, anotherText);
        },

        componentDidUpdate: anotherTextChildDidUpdate
    }),
    // parent component
    parentDidUpdate = jest.genMockFunction(),
    ParentView = React.createClass({
        mixins: [ rk.CursorPropsMixin ],

        getInitialState: function(){
            return { clicks: 0 };
        },

        handleClick: function(){
            this.setState({'clicks': this.state.clicks + 1});
        },

        render: function(){
            return React.createElement(
                "div",
                {onClick: this.handleClick},
                [
                    React.createElement("h1", { key: 0 }, this.state.clicks),
                    React.createElement(TextView, { key: 1, text: this.props.cursor.derive('text') }),
                    React.createElement(AnotherTextView, { key: 2, anotherText: this.props.cursor.derive('anotherText') }),
                ]);
        },

        componentDidUpdate: parentDidUpdate
    }),
    render = function(el, cursor, props){
        var cursorProps = { cursor: cursor },
            finalProps = _.extend(props ? props : {}, cursorProps),
            elem = React.createElement(ParentView, finalProps);
        React.render(elem, el);
        return elem;
    };


describe("CursorPropsMixin", function(){
    afterEach(function(){
        parentDidUpdate.mockClear();
        textChildDidUpdate.mockClear();
        anotherTextChildDidUpdate.mockClear();
        atom.reset(data);
    });

    it("parent re-renders on its local state changes, but children not if they don't need to", function(){
        var el = document.createElement("div");
        render(el, k.cursor(atom));
        Simulate.click(el.firstChild);
        expect(parentDidUpdate).toBeCalled();
        expect(textChildDidUpdate).not.toBeCalled();
        expect(anotherTextChildDidUpdate).not.toBeCalled();
    });

    it("parent re-renders when new props are added, but children not if they don't need to", function() {
        var el = document.createElement("div");
        render(el, k.cursor(atom));
        render(el, k.cursor(atom), { newProp: 42 });
        expect(parentDidUpdate).toBeCalled();
        expect(textChildDidUpdate).not.toBeCalled();
        expect(anotherTextChildDidUpdate).not.toBeCalled();
    });

    it("parent re-renders when prop values are changed, but children not if they don't need to", function() {
        var el = document.createElement("div");
        render(el, k.cursor(atom), { aProp: 42 });
        render(el, k.cursor(atom), { aProp: "foo" });
        expect(parentDidUpdate).toBeCalled();
        expect(textChildDidUpdate).not.toBeCalled();
        expect(anotherTextChildDidUpdate).not.toBeCalled();
    });

    it("nothing re-renders if their cursors aren't affected by a state change", function() {
        var el = document.createElement("div");
        render(el, k.cursor(atom));
        atom.addWatch(function(){
            render(el, k.cursor(atom), {});
        });
        atom.swap(_.identity);
        expect(parentDidUpdate).not.toBeCalled();
        expect(textChildDidUpdate).not.toBeCalled();
        expect(anotherTextChildDidUpdate).not.toBeCalled();
    });

    it("child views re-render when any of the immutable values they point to are changed", function(){
        var el = document.createElement("div");
        render(el, k.cursor(atom));
        atom.addWatch(function(){
            render(el, k.cursor(atom), {});
        });
        expect(parentDidUpdate).not.toBeCalled();
        atom.swap(function(v) { return v.set("text", "lol"); });
        expect(parentDidUpdate).toBeCalled();
        expect(textChildDidUpdate).toBeCalled();
        expect(anotherTextChildDidUpdate).not.toBeCalled();

        textChildDidUpdate.mockClear();
        atom.swap(function(v) { return v.set("anotherText", "lolwut"); });
        expect(parentDidUpdate).toBeCalled();
        expect(textChildDidUpdate).not.toBeCalled();
        expect(anotherTextChildDidUpdate).toBeCalled();
    });
});
