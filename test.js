n('req_spaces_before_url')
    .match(' ', n('req_spaces_before_url'))
    .otherwise(this.isEqual('method', METHODS.CONNECT, {
        equal: url.entry.connect,
        notEqual: url.entry.normal,
    }));