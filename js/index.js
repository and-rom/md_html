$( document ).ready(init);

function init() {
  $('#create').click(create);
  $('#open').click(open);
  $('#save').click(save);
  $('#parse').click(parse);
  $('#publish').click(publish);
  $('#toggle').click(toggle);

  $('#modal').on('hidden.bs.modal', function (e) {
    $('#modal-title').empty();
    $('#modal-body').empty();
    $('#modal-footer').empty();
  });
}

function create(e) {
  if (window.location.hash != "") window.location.hash = "";
  $('#md').val("");
  $('#output').html("");
}

function open(e) {
  $.ajax({
    url: 'processor.php',
    type: 'POST',
    data: {'action':'dir'},
    dataType: "json",
    success: function(data){
      if (data.status == "ok") {
        $('#modal-title').html("Открыть");
        $('#modal-body').append($(document.createElement('div')).addClass('list-group').attr('id','list-group'));
        for (i = 0; i < data.result.length; ++i) {
          $('#list-group').append($(document.createElement('button'))
                                                                          .attr("type","button")
                                                                          .addClass('list-group-item')
                                                                          .addClass('list-group-item-action')
                                                                          .attr("id",data.result[i])
                                                                          .html(data.result[i]));
        }
        $('.list-group-item-action').click(function(e) {
          openFile($(this).attr('id'));
        });
        
        $('#modal-footer').append($(document.createElement('button')).addClass('btn').addClass('btn-default').attr('data-dismiss','modal').html("Закрыть"));
        
        $('#modal').modal('show');
      } else if (data.status == "error") {
          $.notify({message: data.error_msg},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      } else {
          $.notify({message: "Something wrong"},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      }
    }
  });
}

function openFile(e) {
  window.location.hash = e.split(".")[0];
  $('#modal').modal('hide');
  $.ajax({
    url: 'processor.php',
    data: {'action' : 'open',
           'filename' : e},
    type: 'POST',
    dataType: "json",
    success: function(data){
      if (data.status == "ok") {
        $('#md').val(data.result);
        $('#output').html("");
      } else if (data.status == "error") {
          $.notify({message: data.error_msg},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      } else {
          $.notify({message: "Something wrong"},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      }
    }
  });
}

function save(e) {
  if (window.location.hash == "") {
    $('#modal-title').html("Сохранить");
    
    form = $(document.createElement('form'));
    $('#modal-body').append(form);
    div = $(document.createElement('div'));
    div.addClass('form-group');
    form.append(div);
    label = $(document.createElement('label'));
    label.attr('for','filename').addClass('control-label').addClass('sr-only').text("Имя файла");
    div.append(label);    
    input = $(document.createElement('input'));
    input.attr('type','text').addClass('form-control').attr('id','filename').attr('placeholder','Имя файла без расширения');
    div.append(input);
    button = $(document.createElement('button'));
    button.attr('type','button').attr('id','saveFile').addClass('btn').addClass('btn-primary').html("Сохранить");
    $('#modal-footer').append(button);
    $('#saveFile').click(function(e){
        if ($('#filename').val() != "") {
          window.location.hash = $('#filename').val();
          $('#modal').modal('hide');
          saveFile();
        }
    });
    $('#modal-footer').append($(document.createElement('button')).addClass('btn').addClass('btn-default').attr('data-dismiss','modal').html("Закрыть"));
    $('#modal').modal('show');
  } else {
    saveFile();
  }
}

function saveFile() {
  $.ajax({
    url: 'processor.php',
    data: {'action': 'save',
           'filename': window.location.hash.replace("#","")+".md",
           'md': $('#md').val()
          },
    type: 'POST',
    dataType: "json",
    success: function(data){
      if (data.status == "ok") {
        $.notify({message: data.status},{type: 'success',placement: {align: "center"},offset: {y: 50}});
      } else if (data.status == "error") {
        $.notify({message: data.error_msg},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      } else {
        $.notify({message: "Something wrong"},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      } 
    }
  });
}

function parse(e) {
    $.ajax({
      url: 'processor.php',
      data: {'action' : 'parse',
             'md' : $('#md').val()},
      type: 'POST',
      dataType: "json",
      success: function(data){
        if (data.status == "ok") {
          $('#output').html(data.result);
          $.notify({message: "Готово"},{type: 'success',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
        } else if (data.status == "error") {
          $.notify({message: data.error_msg},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
        } else {
          $.notify({message: "Something wrong"},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
        }
      }
    });
}

function publish(e) {
  $.ajax({
    url: 'processor.php',
    data: {'action': 'publish',
           'filename': window.location.hash.replace("#","")+".html",
           'md': $('#md').val()
          },
    type: 'POST',
    dataType: "json",
    success: function(data){
      if (data.status == "ok") {
        $.notify({message: data.status},{type: 'success',placement: {align: "center"},offset: {y: 50}});
      } else if (data.status == "error") {
        $.notify({message: data.error_msg},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      } else {
        $.notify({message: "Something wrong"},{type: 'warning',placement: {from: 'bottom', align: 'center'},offset: {y: 50}});
      } 
    }
  });
}

function toggle(e) {
  $('#editor').toggleClass("hidden-xs");
  $('#output').toggleClass("hidden-xs");
}
