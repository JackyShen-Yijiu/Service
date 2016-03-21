/**
 * Created by li on 2015/11/5.
 */
//处理自增数据
var  Counter=require("./sequence")
module.exports = new (function () {



    this.plugin = function(schema, options) {

        if (!options.model)
            throw new Error('Missing required parameter: model');

        options.model = options.model.toLowerCase() + 'unikey';
        options.field = options.field || 'unikey';
        //options.once = !!options.once;
        //don't use _id, keep it
        options.start = (!isNaN(options.start)) ? options.start : 1;
        options.step = (!isNaN(options.step)) ? options.step : 1;

        var fields = {},
            ready  = false;

        // Adding new field into schema
        fields[options.field] = {
            type:    Number,
            unique:  true,
            require: true
        };
        schema.add(fields);
        //console.log(schema);
        // Initializing of plugin
        Counter.findOne({
            model: options.model,
            field: options.field
        }, function (err, res) {
            if (!res)
                (new Counter({
                    model: options.model,
                    field: options.field,
                    seq:   options.start
                })).save(function () {
                        ready = true;
                    });
            else
                ready = true;
        });
        ready=true;

        schema.pre('save', function (next) {
            var doc = this;

            // Do not increase when exist by default
            // Only when create, not update

            if(doc[options.field] ) {
                return next();
            }

            // Increment method refer to http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/,
            // first method
            function save () {

                if (ready)
                    Counter.collection.findAndModify({
                        model: options.model,
                        field: options.field
                    }, [], {
                        $inc: {
                            seq: options.step
                        }
                    }, {
                        'new':  true,
                        upsert: true
                    }, function (err, res) {


                        if (!err){
                            doc[options.field] = res.value.seq - options.step;}

                        next(err);
                    });
                else
                    setTimeout(save, 5);
                // Delay before plugin will be sucessfully initialized
            }
            save();
        });
    };



})();
