﻿var React = require('react');
var ReactDOM = require('react-dom');
var immutable = require('immutable');
class Danmaku extends React.Component {
    constructor(props) {
        super(props);
        this.duration = 0;
        this.lockIndex = 0;
        this.duration =
            (8 * this.getBytesLength(this.props.msg) * 1.1 +
                window.innerWidth) /
            0.15;
        this.removetimeout =
            (8 * this.getBytesLength(this.props.msg) * 1.05 +
                window.innerWidth) /
            0.15;
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.lockIndex && nextProps.msg) return false;
    }
    getBytesLength(str) {
        return str.replace(/[^\x00-\xff]/g, 'xx').length;
    }
    componentDidMount() {
        this.lockIndex = this.props.lockIndex;
        var time = Math.floor(
            8 * this.getBytesLength(this.props.msg) / 0.15 + 200
        );
        this.props.lock(this.props.lockIndex);
        setTimeout(() => {
            this.props.releaseLock(this.lockIndex);
        }, time);
        setTimeout(() => {
            this.props.removeMsg(this.props.index);
        }, this.duration);
    }
    render() {
        return (
            <span
                className="danmaku"
                key={0}
                style={{
                    top: this.props.lockIndex * 20 + '%',
                    animation: `move ${this.duration}ms linear`
                }}
            >
                <pre>{this.props.msg}</pre>
            </span>
        );
    }
}
class SendDanmaku extends React.Component {
    render() {
        return (
            <input
                className="senddanmaku"
                type="text"
                onChange={this.handlechange}
                onKeyPress={this.handlekeypress}
            />
        );
    }
    constructor(props) {
        super(props);
        this.state = { value: '' };
    }
    handleChange(e) {
        this.setState({ value: e.target.value });
    }
    handleKeypress(e) {
        if (e.keyCode === 13) {
            this.props.socket.send(this.state.value);
        }
    }
}
class Danmakus extends React.Component {
    constructor(props) {
        super(props);
        this.state = { msgQueue: immutable.List(), locks: immutable.List() };
        this.counter = 0;
        this.renderedIndex = -1;
        for (var i = 0; i < 5; i++) {
            this.state.locks = this.state.locks.set(i, false);
        }
        this.lock = this.lock.bind(this);
        this.releaseLock = this.releaseLock.bind(this);
        this.removeMsg = this.removeMsg.bind(this);
    }
    componentDidMount() {
        var socket = new WebSocket('ws://127.0.0.1:12000');
        socket.onmessage = e => {
            this.setState({ msgQueue: this.state.msgQueue.push(e.data) });
        };
    }
    releaseLock(index) {
        this.setState({ locks: this.state.locks.set(index, false) });
    }
    lock(index) {
        this.setState({ locks: this.state.locks.set(index, true) });
    }
    removeMsg(index) {
        this.setState({ msgQueue: this.state.msgQueue.set(index, '') });
    }
    render() {
        var itemList = [];
        var locks = this.state.locks.slice(0);
        this.state.msgQueue.map((msg, i) => {
            if (msg) {
                if (i > this.renderedIndex) {
                    for (var j = 0; j < locks.size; j++) {
                        if (!locks.get(j)) {
                            locks = locks.set(j, true);
                            this.renderedIndex = i;
                            itemList.push(
                                <Danmaku
                                    msg={msg}
                                    removeMsg={this.removeMsg}
                                    lock={this.lock}
                                    releaseLock={this.releaseLock}
                                    lockIndex={j}
                                    key={i}
                                    index={i}
                                />
                            );
                            break;
                        }
                    }
                } else {
                    itemList.push(
                        <Danmaku
                            msg={msg}
                            removeMsg={this.removeMsg}
                            releaseLock={this.releaseLock}
                            key={i}
                            index={i}
                        />
                    );
                }
            }
        });
        return (
            <div id="example">
                {itemList}
                <SendDanmaku socket={this.socket} />
            </div>
        );
    }
}
module.exports = Danmakus;