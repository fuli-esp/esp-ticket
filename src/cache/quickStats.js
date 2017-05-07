/*
     .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 Created:    02/24/2016
 Author:     Chris Brame

 **/

var _               = require('underscore');
var async           = require('async');
var ticketSchema    = require('../models/ticket');

_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });

        return _.object(keys, _.map(keys, function (key) {
            return obj[key];
        }));
    }
});

var init = function(tickets, callback) {
    var obj = {};
    var $tickets = [];

    async.series([
        function(done) {
            if (tickets) {
                ticketSchema.populate(tickets, {path: 'owner comments.owner assignee'}, function(err, _tickets) {
                    $tickets = _tickets;

                    return done();
                });
            } else {
                ticketSchema.getForCache(function(err, tickets) {
                    if (err) return done(err);

                    ticketSchema.populate(tickets, {path: 'owner comments.owner assignee'}, function(err, _tickets) {
                        if (err) return done(err);

                        $tickets = _tickets;

                        return done();
                    });
                });
            }
        },
        function(done) {
            buildMostRequester($tickets, function(result) {
                obj.mostRequester = _.first(result);

                return done();
            });
        },
        function(done) {
            buildMostComments($tickets, function(result) {
                obj.mostCommenter = _.first(result);

                return done();
            });
        },
        function(done) {
            buildMostAssignee($tickets, function(result) {
                obj.mostAssignee = _.first(result);

                return done();
            });
        },
        function(done) {
            buildMostActiveTicket($tickets, function(result) {
                obj.mostActiveTicket = _.first(result);

                return done();
            });
        }

    ], function(err) {
        $tickets = null; //clear it
        if (err) return callback(err);

        return callback(null, obj);
    });
};

function buildMostRequester(ticketArray, callback) {
    var requesters = _.map(ticketArray, function(m) {
        return m.owner.fullname;
    });

    var r = _.reduce(requesters, function(counts, key) {
        counts[key]++;
        return counts;
    }, _.object(_.map(_.uniq(requesters), function(key) {
        return [key, 0];
    })));

    r = _.sortKeysBy(r, function(v) {
        return -v;
    });

    r = _.map(r, function(v, k) {
        return { name: k, value: v};
    });

    return callback(r);
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function buildMostComments(ticketArray, callback) {
    var commenters = _.map(ticketArray, function(m) {
        return _.map(m.comments, function(i) {
            return i.owner.fullname;
        });
    });

    commenters = flatten(commenters);

    var c = _.reduce(commenters, function(c, k) {
        c[k]++;
        return c;
    }, _.object(_.map(_.uniq(commenters), function(key) {
        return [key, 0];
    })));

    c = _.sortKeysBy(c, function(v) {
        return -v;
    });

    c = _.map(c, function(v, k) {
        return { name: k, value: v};
    });

    return callback(c);
}

function buildMostAssignee(ticketArray, callback) {
    ticketArray = _.reject(ticketArray, function(v) {
        return (_.isUndefined(v.assignee) || _.isNull(v.assignee));
    });

    var assignees = _.map(ticketArray, function(m) {
        return m.assignee.fullname;
    });

    var a = _.reduce(assignees, function(c, k) {
        c[k]++;
        return c;
    }, _.object(_.map(_.uniq(assignees), function(key) {
        return [key, 0];
    })));

    a = _.sortKeysBy(a, function(v) {
        return -v;
    });

    a = _.map(a, function(v, k) {
        return { name: k, value: v};
    });

    return callback(a);
}

function buildMostActiveTicket(ticketArray, callback) {
    var tickets = _.map(ticketArray, function(m) {
        return {uid: m.uid, cSize: _.size(m.history) };
    });

    tickets = _.sortBy(tickets, 'cSize').reverse();

    return callback(tickets);
}

module.exports = init;