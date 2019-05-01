'use strict';

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
  db.createTable('assignments', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    due_date_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'assignments_due_dates_fk',
        table: 'due_dates',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    from_person_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'assignments_from_people_fk',
        table: 'people',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    to_person_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'assignments_to_people_fk',
        table: 'people',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    complete: {
      type: 'boolean',
      defaultValue: false
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('assignments', callback);
};

exports._meta = {
  "version": 1
};
