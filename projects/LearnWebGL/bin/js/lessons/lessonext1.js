var LESSONS;
(function (LESSONS) {
    /**
     * 第五课
     */
    var lesson5 = (function () {
        function lesson5() {
            LESSONS._watcher.name = "第五课";
            console.info("lesson5");
        }
        lesson5.prototype.updateFarme = function (dt) {
        };
        return lesson5;
    }());
    LESSONS.lesson5 = lesson5;
})(LESSONS || (LESSONS = {}));
