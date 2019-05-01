var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('due_dates', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: 'date',
      notNull: true
    },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('due_dates', callback);
};

exports._meta = {
  "version": 1
};
