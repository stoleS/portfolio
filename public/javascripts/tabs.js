function switchToAll() {
      removeActive();
      hideAll();
      $("#all-tab").addClass("is-active");
      $("#all-tab-content").removeClass("hidden");
    }
    function switchToAdd() {
      removeActive();
      hideAll();
      $("#add-tab").addClass("is-active");
      $("#add-tab-content").removeClass("hidden");
    }
    function removeActive() {
      $("li").each(function() {
        $(this).removeClass("is-active");
      });
    }
    function hideAll(){
      $("#all-tab-content").addClass("hidden");
      $("#add-tab-content").addClass("hidden");
    }