$(document).ready(function () {
    $.each($("a.nav-link"), function (idx, item) {
        if (item.href == href()) {
            $(item).parent().addClass("active");
            return false;
        }
    });
});

function href() {
    var result = location.href;

    var idx = result.lastIndexOf("#");
    if (idx == -1) {
        return result;
    }
    return result.substr(0, idx);
}
