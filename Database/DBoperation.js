var mongoose = require('mongoose');
var mongoose_conn = require("./mongoose_conn.js ");
mongoose_conn.connect();


require("./SchemaClass");
var ModuleSchema = mongoose.model('moduleSchema');
require("./tagSchema");
var TagSchema = mongoose.model('tagSchema');

//require SchemaClass

class dbOpration {

    constructor(app) {
            this.app = app;
        }
        /* 
         * Insert all parsing results into Database.
         * req.data holds the parsing results.
         */
    add(req, res) {
            ModuleSchema.insertMany(req.data, (err, docs) => {
                if (!err) {
                    res.status(200).send({
                        isSuccess: true,
                        docs: docs
                    });
                } else {
                    res.status(503).send({ isSuccess: false });
                }
            });
        }
        /* 
         * Find data by path name.
         * req.data holds the path name.
         */
    find(req, res) {
            ModuleSchema.find({ path: req.data }, (err, docs) => {
                console.log(docs)
                if (!err) {
                    res.status(200).send({ docs: docs });
                } else {
                    console.log(err);
                }
            })
        }
        /* 
         * Find data by mongoose id.
         * req.data holds the id.
         */
    findById(req, res) {
        var id = req.data;
        ModuleSchema.find({ "classes._id": id }, (err, docs) => {
            console.log(docs)
            if (!err) {
                res.status(200).send({ docs: docs });
            } else {
                console.log(err);
            }
        })
    }

    findAll(req, res) {
            ModuleSchema.find({}, (err, docs) => {
                if (!err) {
                    res.status(200).send({ docs: docs });
                } else {
                    console.log(err);
                }
            }).sort({ _id: -1 }).limit(parseInt(req.data))
        }
        /* 
         * Add tag into database.
         */
    addTag(req, res) {
            console.log(req.data)
            TagSchema.insertMany(req.data, (err, docs) => {
                if (!err) {
                    res.status(200).send({ docs: docs });
                } else {
                    console.log(err);
                }
            })
        }
        /* 
         * Get all tags data in database.
         */
    getTags(req, res) {
        TagSchema.find({}, (err, docs) => {
            if (!err) {
                res.status(200).send({ docs: docs });
            } else {
                console.log(err);
            }
        }).sort({ _id: -1 }).limit(parseInt(req.data))
    }
}



module.exports = dbOpration;