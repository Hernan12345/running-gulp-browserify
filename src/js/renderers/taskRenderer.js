'use strict';

// Variable privada. Accesible solamente en este contexto, no es visible desde afuera de este archivo por no usar exports
// Browserify utiliza require para cargar jquery, instalado via npm.
var $ = require('jquery'),
    taskTemplate = require('../../templates/task.hbs');

// Función privada. Accesible solamente en este contexto, no es visible desde afuera de este archivo por no usar exports
function _renderTask(task) {
    return $(taskTemplate(task));
}

// Funciones públicas. Las funciones con exports son accesibles desde fuera de este archivo.
exports.renderTasks = function(tasks) {
    var elementArray = $.map(tasks, _renderTask);
    $('#task-list').empty().append(elementArray);
};

exports.renderNew = function() {
    var $taskList = $('#task-list');
    $taskList.prepend(_renderTask({}));
};