'use strict';

// Variable privada. Accesible solamente en este contexto, no es visible desde afuera de este archivo por no usar exports.
var STORAGE_NAME = 'tasks';

// Funciones públicas. Las funciones con exports son accesibles desde fuera de este archivo.
exports.save = function(tasks) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(tasks));
};

exports.load = function() {
    var storedTasks = localStorage.getItem(STORAGE_NAME);

    if (storedTasks) {
        return JSON.parse(storedTasks);
    }

    return [];
};

exports.clear = function() {
    localStorage.removeItem(STORAGE_NAME);
};