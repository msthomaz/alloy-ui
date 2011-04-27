AUI.add('aui-datatable-base', function(A) {
// DataTable component is beta, over-writing buggy logic on it before they get fixed on YUI

var CHILD_NODES = 'childNodes',
	COLUMNSET = 'columnset',
	DATA = 'data',
	HEADERS = 'headers',
	ID = 'id',

	_SPACE = ' ';

A.DataTable.Base = A.Base.create('datatable', A.DataTable.Base, [], {
	getColumnByCell: function(cell) {
		var instance = this;
		var dataHeaderId = cell.getAttribute(HEADERS).split(_SPACE).pop() || cell.get(ID);

		return instance.get(COLUMNSET).getColumn(dataHeaderId);
	},

	getColNode: function(cell) {
		var instance = this;
		var index = instance.get(COLUMNSET).getColumnIndex(instance.getColumnByCell(cell));

		return instance._colgroupNode.get(CHILD_NODES).item(index);
	}
}, {});

A.Columnset = A.Base.create('columnset', A.Columnset, [], {
	getColumn: function(i) {
		return this.idHash[i];
	},

	getColumnIndex: function(column) {
		return column.keyIndex;
	},

	_setDefinitions: function(val) {
		return val;
	}
}, {});

A.Recordset = A.Base.create('recordset', A.Recordset, [], {
	getRecordByRow: function(row) {
		var instance = this;

		return instance.getRecord(row.get(ID));
	},

	getRecordIndex: function(record) {
		var instance = this;

		return instance._items.indexOf(record);
	},

	updateRecordDataByKey: function(record, key, value) {
		var instance = this;
		var data = record.get(DATA);

		if (data) {
			data[key] = value;
			record.set(DATA, data);
		}

		instance.update(record, instance.getRecordIndex(record));
	}
}, {});

}, '@VERSION@' ,{requires:['aui-base','datatable','plugin']});