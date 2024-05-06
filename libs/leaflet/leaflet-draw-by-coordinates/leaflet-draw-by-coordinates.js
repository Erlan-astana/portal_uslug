(function (window, document, undefined) {
    'use strict';

L.Control.ToolPanel = L.Control.extend({
    options: {position: 'topright'},
    initialize: function(options) {
        L.Util.setOptions(this, options);
    },
    onAdd: function(map) {
        this._map = map;

        var panel = this.initToolPanel();
        return panel;
    },
    onRemove: function(map) {
    },
    initDrawToolBtn: function() {
        var drawToolBtn = L.DomUtil.create('input', 'draw-by-coordinates-tool');
            drawToolBtn.type = 'button';
            drawToolBtn.title = 'Координаты';
        this._drawToolBtn = drawToolBtn;
        L.DomEvent.addListener(this._drawToolBtn, 'click', this.showToolPanel, this);

        // this.initToolPanel();
        return drawToolBtn;
    },
    initToolPanel: function() {
        var container = document.createElement('div');
            container.className = 'draw-by-coordinates-panel';

        this._container = container;
        this.initActionBtn();
        setTimeout(() => {
            this.initCoordFields();
        }, 100);
        return container;
    },
    initActionBtn: function() {
        var actionBlock = document.createElement('div');
            actionBlock.className = 'draw-panel-action-block';
        this._actionBlock = actionBlock;
        this._container.appendChild(actionBlock);

        var addCoordFieldBtn = L.DomUtil.create('button', 'geom-coords-add-field', actionBlock);
            addCoordFieldBtn.type = 'button';
            addCoordFieldBtn.textContent = 'Добавить поле';
        this._addCoordFieldBtn = addCoordFieldBtn;
        L.DomEvent.addListener(this._addCoordFieldBtn, 'click', this.addCoordFields, this);
        
        var calculateBtn = L.DomUtil.create('button', 'geom-coords-calculate', actionBlock);
            // calculateBtn.className = 'geom-coords-calculate';
            calculateBtn.type = 'button';
            calculateBtn.textContent = 'Нарисовать';
            // actionBlock.appendChild(calculateBtn);
        this._calculateBtn = calculateBtn;
        // L.DomEvent.addListener(this._calculateBtn, 'click', this.calculate, this);
    },
    initCoordFields: function() {
        for (let i = 0; i < 3; i++) {
            this.initFieldBlock();
        }
    },
    createCoordFields: function() {
        var fields = [];
        for (let i = 0; i < 2; i++) {
            var div = L.DomUtil.create('div');
                div.style.flex = '1';
                div.style.margin = '5px';
            if (i % 2 == 0) {
                div.innerHTML = `<label for="geom-coord-x" style="width: 100%">X</label> </br>
                    <input type="number" id="geom-coord-x" class="draw-panel-geom-coord" style="width: 130px">`;
            } else {
                div.innerHTML = `<label for="geom-coord-y" style="width: 100%">Y</label> </br>
                    <input type="number" id="geom-coord-y" class="draw-panel-geom-coord" style="width: 130px">`;
            }
            fields.push(div);
        }
        return fields;
    },
    initFieldBlock: function() {
        const fields = this.createCoordFields();
        var panel = this._container;
        var coordField = L.DomUtil.create('div');
            coordField.width = '100%';
            coordField.style.display = 'flex';
            coordField.style.flexDirection = 'row';

        for (let k = 0; k < fields.length; k++) {
            coordField.appendChild(fields[k]);
        }
        panel.insertBefore(coordField, this._actionBlock);
    },
    setEvents: function() {
        L.DomEvent.addListener(this._drawToolBtn, 'click', this.showToolPanel, this);
        L.DomEvent.addListener(this._addCoordFieldBtn, 'click', this.addCoordFields, this);
        L.DomEvent.addListener(this._calculateBtn, 'click', this.calculate, this);
    },
    addCoordFields: function() {
        if (this._addCoordFieldBtn) {
            this.initFieldBlock();
        }
    },
    calculate: function () {
        this._coordFields = document.getElementsByClassName('draw-panel-geom-coord');
        var fieldFilter = [].filter.call( this._coordFields, function( el ) {
            return el.value === '';
        });
        if (fieldFilter.length < 1) {
            const latlngs = [];
            let arr = [];
            for (let i = 0; i < this._coordFields.length; i++) {
                const element = this._coordFields[i].value;
                arr.push(Number(element));
                if (arr.length > 1) {
                    latlngs.push(arr);
                    arr = [];
                }
            }
            var polygon = L.polygon(latlngs, {
                color: 'red'
            });
            // .addTo(this._map);
            // this._map.fitBounds(polygon.getBounds());
            this._polygon = polygon;
            return polygon;
        } else {
            alert('Есть не заполненные поля!');
            this._polygon = null;
            return null;
        }
    },
    checkCoordFields: function() {
        var arr = [].filter.call( this._coordFields, function( el ) {
            return el.value === '';
        });
        if (arr.length > 0) {
            return false;
        } else {
            return true;
        }
    },
});

L.control.toolPanel = function() {
    return new L.Control.ToolPanel();
};

}(window, document));