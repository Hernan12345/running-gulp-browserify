'use strict';

var $ = require('jquery'),
    taskData = require('./data/taskData'),
    taskRenderer = require('./renderers/taskRenderer');

exports.add = function() {
    taskRenderer.renderNew();
};

exports.save = function() {
    var tasks = [];

    $('#task-list .task').each(function(index, task) {
        var $task = $(task);
        tasks.push({
            complete: $task.find('.complete').prop('checked'),
            description: $task.find('.description').val()
        });
    });

    taskData.save(tasks);
};

exports.remove = function(clickEvent) {
    $(clickEvent.target).closest('.task').remove();
};

exports.clear = function() {
    taskData.clear();
    exports.render();
};

exports.render = function() {
    taskRenderer.renderTasks(taskData.load());
};

exports.cancel = function() {
    exports.render();
};