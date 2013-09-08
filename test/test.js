var assert = chai.assert;

var mockData = [
  { a: 1, b: 2, c:'a' },
  { a: 1, b: 3, c:'b' },
  { a: 1, b: 3, c:'c' },
  { a: 2, b: 2, c:'20' },
  { a: 2, b: 2, c:'3' }
];

var filtered, superset;

describe('filtered collection', function() {

  beforeEach(function() {
    superset = new Backbone.Collection(mockData);
    filtered = new FilteredCollection(superset);
  });

  describe('getting access to the original superset', function() {

    it('should return the original superset', function() {
      assert(filtered.superset() === superset);
    });

  });

  describe('collection filtered with objects, static values', function() {

    it('should filter results on `filterBy`', function() {
      assert(filtered.length === 5);

      // add a filter on the 'a' key
      filtered.filterBy('a = 1', { a: 1 });
      assert(filtered.length === 3);

      // add a second filter on the 'b' key
      filtered.filterBy('b = 2', { b: 2 });
      assert(filtered.length === 1);
    });

    it('should delete filters on `removeFilter`', function() {
      // add two filters
      filtered.filterBy('a = 1', { a: 1 });
      filtered.filterBy('b = 2', { b: 2 });
      assert(filtered.length === 1);

      // You can eliminate a filter by name
      filtered.removeFilter('a = 1');
      assert(filtered.length === 3);
    });

    it('should remove all filters on `resetFilters`', function() {
      // add two filters
      filtered.filterBy('a = 1', { a: 1 });
      filtered.filterBy('b = 2', { b: 2 });
      assert(filtered.length === 1);

      filtered.resetFilters();
      assert(filtered.length === 5);
    });

    it('`filterBy` should be chainable', function() {
      filtered
        .filterBy('a = 1', { a: 1 })
        .filterBy('b = 2', { b: 2 });

      assert(filtered.length === 1);
    });

    it('`removeFilter` should be chainable', function() {
      filtered
        .filterBy('a = 1', { a: 1 })
        .filterBy('b = 2', { b: 2 })
        .removeFilter('a = 1')
        .removeFilter('b = 2');

      assert(filtered.length === 5);
    });

    it('`resetFilters` should be chainable', function() {
      filtered
        .filterBy('a = 1', { a: 1 })
        .filterBy('b = 2', { b: 2 })
        .resetFilters();

      assert(filtered.length === 5);

      filtered
        .filterBy('a = 1', { a: 1 })
        .filterBy('b = 2', { b: 2 })
        .resetFilters()
        .filterBy('a = 1', { a: 1 });

      assert(filtered.length === 3);
    });

    it('filters with the same name should replace each other', function() {
      filtered.filterBy('a filter', { a: 1 });
      assert(filtered.length === 3);

      filtered.filterBy('a filter', { a: 3 });
      assert(filtered.length === 0);
    });

    it('filtered collection should contain the original models', function() {
      filtered.filterBy('a = 1', { a: 1 });

      var first = superset.first();
      var filteredFirst = filtered.first();

      // The original model should be the model found in the
      // filtered collection.
      assert(first === filteredFirst);
      assert(_.isEqual(first.toJSON(), filteredFirst.toJSON()));

      // Triggering an event on one model should be fire events
      // on the other since they are just references to the same
      // object.
      var called = false;
      var spy = function() {
        called = true;
      };
      filteredFirst.on('test', spy);
      first.trigger('test');
      assert(called);
    });

  });

  describe('collection filtered with objects, function values', function() {

    it('should filter results on `filterBy`', function() {
      assert(filtered.length === 5);

      // add a filter on the 'a' key
      filtered.filterBy('a = 1', { a: function(val) { return val === 1; } });
      assert(filtered.length === 3);

      // add a second filter on the 'b' key
      filtered.filterBy('b = 2', { b: function(val) { return val === 2; } });
      assert(filtered.length === 1);
    });

    it('should delete filters on `removeFilter`', function() {
      // add two filters
      filtered.filterBy('a = 1', { a: function(val) { return val === 1; } });
      filtered.filterBy('b = 2', { b: function(val) { return val === 2; } });
      assert(filtered.length === 1);

      // You can eliminate a filter by name
      filtered.removeFilter('a = 1');
      assert(filtered.length === 3);
    });

    it('should remove all filters on `resetFilters`', function() {
      // add two filters
      filtered.filterBy('a = 1', { a: function(val) { return val === 1; } });
      filtered.filterBy('b = 2', { b: function(val) { return val === 2; } });
      assert(filtered.length === 1);

      filtered.resetFilters();
      assert(filtered.length === 5);
    });

    it('`filterBy` should be chainable', function() {
      filtered
        .filterBy('a = 1', { a: function(val) { return val === 1; } })
        .filterBy('b = 2', { b: function(val) { return val === 2; } });

      assert(filtered.length === 1);
    });

    it('`removeFilter` should be chainable', function() {
      filtered
        .filterBy('a = 1', { a: function(val) { return val === 1; } })
        .filterBy('b = 2', { b: function(val) { return val === 2; } })
        .removeFilter('a = 1')
        .removeFilter('b = 2');

      assert(filtered.length === 5);
    });

    it('`resetFilters` should be chainable', function() {
      filtered
        .filterBy('a = 1', { a: function(val) { return val === 1; } })
        .filterBy('b = 2', { b: function(val) { return val === 2; } })
        .resetFilters();

      assert(filtered.length === 5);

      filtered
        .filterBy('a = 1', { a: function(val) { return val === 1; } })
        .filterBy('b = 2', { b: function(val) { return val === 2; } })
        .resetFilters()
        .filterBy('a = 1', { a: function(val) { return val === 1; } });

      assert(filtered.length === 3);
    });

    it('filters with the same name should replace each other', function() {
      filtered.filterBy('a filter', { a: function(val) { return val === 1; } });
      assert(filtered.length === 3);

      filtered.filterBy('a filter', { a: function(val) { return val === 3; } });
      assert(filtered.length === 0);
    });

    it('filtered collection should contain the original models', function() {
      filtered.filterBy('a = 1', { a: function(val) { return val === 1; } });

      var first = superset.first();
      var filteredFirst = filtered.first();

      // The original model should be the model found in the
      // filtered collection.
      assert(first === filteredFirst);
      assert(_.isEqual(first.toJSON(), filteredFirst.toJSON()));

      // Triggering an event on one model should be fire events
      // on the other since they are just references to the same
      // object.
      var called = false;
      var spy = function() {
        called = true;
      };
      filteredFirst.on('test', spy);
      first.trigger('test');
      assert(called);
    });

  });

  describe('collection filtered with functions', function() {

    it('should filter results on `filterBy`', function() {
      assert(filtered.length === 5);

      // add a filter on the 'a' key
      filtered.filterBy('a = 1', function(model) {
        return model.get('a') === 1;
      });
      assert(filtered.length === 3);

      // add a second filter on the 'b' key
      filtered.filterBy('b = 2', function(model) {
        return model.get('b') === 2;
      });
      assert(filtered.length === 1);
    });

    it('should delete filters on `removeFilter`', function() {
      // add two filters
      filtered.filterBy('a = 1', function(model) {
        return model.get('a') === 1;
      });
      filtered.filterBy('b = 2', function(model) {
        return model.get('b') === 2;
      });
      assert(filtered.length === 1);

      // You can eliminate a filter by name
      filtered.removeFilter('a = 1');
      assert(filtered.length === 3);
    });

    it('should remove all filters on `resetFilters`', function() {
      // add two filters
      filtered.filterBy('a = 1', function(model) {
        return model.get('a') === 1;
      });
      filtered.filterBy('b = 2', function(model) {
        return model.get('b') === 2;
      });
      assert(filtered.length === 1);

      filtered.resetFilters();
      assert(filtered.length === 5);
    });

    it('`filterBy` should be chainable', function() {
      filtered
        .filterBy('a = 1', function(model) {
        return model.get('a') === 1;
      })
        .filterBy('b = 2', function(model) {
        return model.get('b') === 2;
      });

      assert(filtered.length === 1);
    });

    it('`removeFilter` should be chainable', function() {
      filtered
        .filterBy('a = 1', function(model) {
          return model.get('a') === 1;
        })
        .filterBy('b = 2', function(model) {
          return model.get('b') === 2;
        })
        .removeFilter('a = 1')
        .removeFilter('b = 2');

      assert(filtered.length === 5);
    });

    it('`resetFilters` should be chainable', function() {
      filtered
        .filterBy('a = 1', function(model) {
          return model.get('a') === 1;
        })
        .filterBy('b = 2', function(model) {
          return model.get('b') === 2;
        })
        .resetFilters();

      assert(filtered.length === 5);

      filtered
        .filterBy('a = 1', function(model) {
          return model.get('a') === 1;
        })
        .filterBy('b = 2', function(model) {
          return model.get('b') === 2;
        })
        .resetFilters()
        .filterBy('a = 1', function(model) {
          return model.get('a') === 1;
        });

      assert(filtered.length === 3);
    });

    it('filters with the same name should replace each other', function() {
      filtered.filterBy('a filter', function(model) {
        return model.get('a') === 1;
      });
      assert(filtered.length === 3);

      filtered.filterBy('a filter', function(model) {
        return model.get('a') === 3;
      });
      assert(filtered.length === 0);
    });

    it('filtered collection should contain the original models', function() {
      filtered.filterBy('a = 1', function(model) {
        return model.get('a') === 1;
      });

      var first = superset.first();
      var filteredFirst = filtered.first();

      // The original model should be the model found in the
      // filtered collection.
      assert(first === filteredFirst);
      assert(_.isEqual(first.toJSON(), filteredFirst.toJSON()));

      // Triggering an event on one model should be fire events
      // on the other since they are just references to the same
      // object.
      var called = [];
      var spy = function() {
        called.push(true);
      };
      filteredFirst.on('test', spy);
      first.trigger('test');
      assert(called.length === 1);
    });

  });

  describe('filtering without a filter name', function() {

    it('should accept a filter with no name', function() {
      filtered.filterBy({ a: 1 });

      assert(filtered.length === 3);
    });

    it('should replace that filter if called again', function() {
      filtered.filterBy({ a: 1 });
      filtered.filterBy({ a: 2 });

      assert(filtered.length === 2);
    });

    it('should remove that filter if removeFilter is called', function() {
      filtered.filterBy({ a: 1});
      filtered.removeFilter();

      assert(filtered.length === superset.length);
      assert(_.isEqual(filtered.toJSON(), superset.toJSON()));
    });

    it("shouldn't cause issues if named filters are added after", function() {
      filtered.filterBy({ a: 1});
      filtered.filterBy('named', { b: 2 });

      assert(filtered.length === 1);

      // This will remove the unnamed filter, leaving the named filter
      filtered.removeFilter();
      assert(filtered.length === 3);

      // And then we can remove the unnamed filter as well
      filtered.removeFilter('named');
      assert(filtered.length === 5);
    });

  });

  describe('changing a model in the superset', function() {

    describe('a model changes to fit the filter function', function() {

      it('should be added to the filtered collection', function() {
        // Add a filter on the 'a' key
        // This leaves 3 models
        filtered.filterBy('a = 1', { a: 1 });

        // The last model in the set should have a = 2
        // and not be present in the filtered collection
        var lastModel = superset.last();
        assert(lastModel.get('a') === 2);
        assert(filtered.contains(lastModel) === false);

        // However if we change the 'a' parameter to 1,
        // it should show up in the filtered collection
        lastModel.set({ a: 1 });
        assert(filtered.length === 4);
        assert(filtered.contains(lastModel));
      });

      it('should not fire a change event', function() {
        // Add a filter on the 'a' key
        // This leaves 3 models
        filtered.filterBy('a = 1', { a: 1 });

        var changeEventA = false;
        var changeEvent = false;
        var addEvent = false;

        filtered.on('add', function() {
          addEvent = true;
        });

        filtered.on('change', function() {
          changeEvent = true;
        });

        filtered.on('change:a', function() {
          changeEventA = true;
        });

        // The last model in the set should have a = 2
        // and not be present in the filtered collection
        var lastModel = superset.last();

        // However if we change the 'a' parameter to 1,
        // it should show up in the filtered collection
        lastModel.set({ a: 1 });
        assert(addEvent);
        assert(!changeEvent);
        assert(!changeEventA);
      });

    });

    describe('a model changes to not fit the filter function', function() {

      it('should be removed from the filtered collection', function() {
        // Add a filter on the 'a' key
        // This leaves 3 models
        filtered.filterBy('a = 1', { a: 1 });

        // The first model in the set should have a = 1
        // and be present in the filtered collection
        var firstModel = superset.first();
        assert(firstModel.get('a') === 1);
        assert(filtered.contains(firstModel));

        // However if we change the 'a' parameter to 2,
        // it should disappear from the filtered collection
        firstModel.set({ a: 2 });
        assert(filtered.length === 2);
        assert(filtered.contains(firstModel) === false);
      });

      it('change event should not fire, only remove', function() {
        // Add a filter on the 'a' key
        // This leaves 3 models
        filtered.filterBy('a = 1', { a: 1 });

        var removeEvent = false;
        var changeEvent = false;
        var changeEventA = false;

        filtered.on('change', function() {
          changeEvent = true;
        });

        filtered.on('change:a', function() {
          changeEventA = true;
        });

        filtered.on('remove', function() {
          removeEvent = true;
        });

        // The first model in the set should have a = 1
        // and be present in the filtered collection
        var firstModel = superset.first();
        assert(firstModel.get('a') === 1);
        assert(filtered.contains(firstModel));

        // If we change the 'a' parameter to 2,
        // it should disappear from the filtered collection
        firstModel.set({ a: 2 });
        assert(removeEvent);
        assert(!changeEvent);
        assert(!changeEventA);
      });

    });

  });

  describe('removing a model in the superset', function() {

    it("no update when already filtered", function() {
      // Add a filter on the 'a' key
      // This leaves 3 models
      filtered.filterBy('a = 1', { a: 1 });

      // The last model in the set should have a = 2
      // and not be present in the filtered collection
      var lastModel = superset.last();
      assert(lastModel.get('a') === 2);
      assert(filtered.contains(lastModel) === false);
      assert(filtered.length === 3);

      // Now we remove it from the superset
      superset.remove(lastModel);

      // And the filtered subset should stay the same
      assert(filtered.contains(lastModel) === false);
      assert(filtered.length === 3);
    });

    it("update when not already filtered", function() {
      // Add a filter on the 'a' key
      // This leaves 3 models
      filtered.filterBy('a = 1', { a: 1 });

      // The first model in the set should have a = 1
      // and be present in the filtered collection
      var firstModel = superset.first();
      assert(firstModel.get('a') === 1);
      assert(filtered.contains(firstModel));
      assert(filtered.length === 3);

      // Now we remove it from the superset
      superset.remove(firstModel);

      // And the filtered subset should update
      assert(filtered.contains(firstModel) === false);
      assert(filtered.length === 2);
    });

  });
  //
  describe('destroying a model in the superset', function() {

    it("no update when already filtered", function() {
      // Add a filter on the 'a' key
      // This leaves 3 models
      filtered.filterBy('a = 1', { a: 1 });

      // The last model in the set should have a = 2
      // and not be present in the filtered collection
      var lastModel = superset.last();
      assert(lastModel.get('a') === 2);
      assert(filtered.contains(lastModel) === false);
      assert(filtered.length === 3);

      // Now we *destory it!*
      lastModel.destroy();

      // And the filtered subset should stay the same
      assert(filtered.contains(lastModel) === false);
      assert(filtered.length === 3);
    });

    it("update when not already filtered", function() {
      // Add a filter on the 'a' key
      // This leaves 3 models
      filtered.filterBy('a = 1', { a: 1 });

      // The first model in the set should have a = 1
      // and be present in the filtered collection
      var firstModel = superset.first();
      assert(firstModel.get('a') === 1);
      assert(filtered.contains(firstModel));
      assert(filtered.length === 3);

      // Now we *destory it!*
      firstModel.destroy();

      // And the filtered subset should update
      assert(filtered.contains(firstModel) === false);
      assert(filtered.length === 2);
    });

  });

  describe('forcing a refilter', function() {
    var count;

    beforeEach(function() {
      count = 0;

      filtered.filterBy('first filter', function(model) {
        count = count + 1;
        return true;
      });

      filtered.filterBy('second filter', function(model) {
        count = count + 1;
        return true;
      });
    });

    it('the whole collection', function() {
      // Due to the two filters, count should be 2 * length
      assert(count === 2 * superset.length);

      // Trigger a refilter
      filtered.refilter();

      // Each of the functions should have been called again
      // for each model. `count` should now be 4 * length
      assert(count === 4 * superset.length);
    });

    it('should re-evaluate the filter when no name is passed', function() {
      filtered.filterBy('third filter', { a: 1 });

      assert(filtered.length === 3);

      // This should not have re-run the counted filters
      assert(count === 2 * superset.length);

      var model = filtered.first();

      // Change the target on the first model, but silence the event
      model.set({ a: 2 }, { silent: true });

      // The model should still be in the collection
      assert(filtered.length === 3);
      assert(filtered.first() === model);

      // Now trigger a refilter of all filter functions
      filtered.refilter();

      // The model should no longer be in the collection
      assert(filtered.length === 2);
      assert(filtered.first() !== model);
    });

  });

  describe('triggering a refilter on a model', function() {
    var count, lastModel;

    beforeEach(function() {
      count = 0;
      lastModel = null;

      filtered.filterBy(function(model) {
        lastModel = model;
        count = count + 1;
        return true;
      });
    });

    it('should call the filter function again when triggered', function() {
      var model = filtered.first();

      // The filter function should have been called once for each model
      assert(count === superset.length);

      // Trigger a refilter on this particular model
      filtered.refilter(model);

      // The filter function should have been run once more on this model
      assert(count === superset.length + 1);
      assert(lastModel === model);
    });

    it("should filter out a model that's changed", function() {
      var model = filtered.first();

      filtered.filterBy('filter', { a: 1 });

      // Silently changing a model should have no effect
      assert(filtered.length === 3);
      model.set({ a: 2 }, { silent: true });
      assert(filtered.length === 3);

      // Trigger a refilter on this particular model
      filtered.refilter(model);

      // Now the filtered collection should be updated
      assert(filtered.length === 2);
    });

  });

  describe('Pipe events from the subset to the container', function() {
    var resetData = [
      { d: 1, e: 2, f:'a' },
      { d: 1, e: 3, f:'b' },
      { d: 1, e: 3, f:'c' },
      { d: 2, e: 2, f:'3' }
    ];

    it('add event', function() {
      var model = new Backbone.Model({ a: 2 });

      var called = false;
      filtered.on('add', function(m, collection) {
        assert(m === model);
        assert(collection === filtered);
        called = true;
      });

      superset.add(model);

      assert(called);
    });

    it("no add event when the model doesn't fit the filter", function() {
      filtered.filterBy({ a: 1 });

      var model = new Backbone.Model({ a: 2 });

      var called = false;
      filtered.on('add', function(m, collection) {
        called = true;
      });

      superset.add(model);

      assert(!called);
    });

    it('remove event', function() {
      var model = superset.first();

      var called = false;
      filtered.on('remove', function(m, collection) {
        assert(m === model);
        assert(collection === filtered);
        called = true;
      });

      superset.remove(model);

      assert(called);
    });

    it("no remove event when the model doesn't fit the filter", function() {
      filtered.filterBy({ a: 2 });
      var model = superset.first();

      assert(model.get('a') === 1);
      assert(!filtered.contains(model));

      var called = false;
      filtered.on('remove', function(m, collection) {
        assert(m === model);
        assert(collection === filtered);
        called = true;
      });

      superset.remove(model);

      assert(!called);
    });

    it('reset event', function() {
      var called = false;
      filtered.on('reset', function(collection) {
        assert(collection === filtered);
        called = true;
      });

      superset.reset(resetData);

      assert(called);
    });

    it('model change event', function() {
      var model = superset.first();

      var called = false;
      filtered.on('change', function(m) {
        assert(m === model);
        called = true;
      });

      model.set({ a: 100 });

      assert(called);
    });

    it("no model change event when the model doesn't fit the filter", function() {
      filtered.filterBy({ a: 2 });
      var model = superset.first();

      assert(model.get('a') === 1);
      assert(!filtered.contains(model));

      var called = false;
      filtered.on('change', function(m) {
        called = true;
      });

      model.set({ a: 100 });

      assert(!called);
    });

    it('model change event: specify key', function() {
      var model = superset.first();

      var called = false;
      filtered.on('change:a', function(m) {
        assert(m === model);
        called = true;
      });

      model.set({ a: 100 });

      assert(called);
    });

    it("no change event: key when the model doesn't fit the filter", function() {
      filtered.filterBy({ a: 2 });
      var model = superset.first();

      assert(model.get('a') === 1);
      assert(!filtered.contains(model));

      var called = false;
      filtered.on('change:a', function(m) {
        called = true;
      });

      model.set({ a: 100 });

      assert(!called);
    });

    it('adding a new filter triggers a reset', function() {
      var called = false;

      filtered.on('reset', function(collection) {
        assert(collection === filtered);
        called = true;
      });

      filtered.filterBy({ a: 2 });

      assert(called);
    });

  });

  describe('filter-specific events', function() {

    it('filtered:add', function() {
      var called = false;
      var name;

      filtered.on('filtered:add', function(filterName) {
        called = true;
        name = filterName;
      });

      filtered.filterBy('foo', function(model) {
        return true;
      });

      assert(called);
      assert(name === 'foo');
    });

    it('filtered:remove', function() {
      var called = false;
      var name;

      filtered.on('filtered:remove', function(filterName) {
        called = true;
        name = filterName;
      });

      filtered.filterBy('foo', function(model) {
        return true;
      });

      filtered.removeFilter('foo');

      assert(called);
      assert(name === 'foo');
    });

    it('filtered:reset', function() {
      var called = false;

      filtered.on('filtered:reset', function() {
        called = true;
      });

      filtered.filterBy('foo', function(model) {
        return true;
      });

      filtered.resetFilters();

      assert(called);
    });

  });

});


