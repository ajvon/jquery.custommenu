
/*!
* jQuery custommenu plugin
* Original author: @ajvon 
* Web: https://github.com/ajvon
* Licensed under the MIT license
*/

(function ( $ ) {
    
    var element = null;
    var button = null;
    var content = null;
    var list = null;
    var links = [];
    var options = null;
    
    $.fn.custommenu = function(cOptions) {
        options = $.extend({}, $.fn.custommenu.defaults, cOptions);
        
        try {
            var c = document.cookie.replace(/(?:(?:^|.*;\s*)custommenu\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            links = JSON.parse(c);
        }
        catch(err) {
            links = [];
        }
        
        if (!$.isArray(links))
            links = [];
            
        element = $('<div class="cm-container"></div>');
        
        button = $('<a href="javascript:" class="cm-button"></a>');
        element.append(button);
        
        content = $('<div class="cm-content"></div>');
        element.append(content);
        
        var heading = $('<h2></h2>');
        content.append(heading);
        
        var inputContainer = $('<div class="cm-inputContainer"><label for="cm-input">' + options.strings.addPageLabel + '</label><br /></div>');
        input = $('<input id="cm-input" type="text" placeholder="' + options.strings.pageTitle + '" />');
        var inputButton = $('<button></button>');
        inputButton.attr('title', options.strings.addPage);
        inputContainer.append(inputButton);
        inputContainer.append(input);
        content.append(inputContainer);
        
        list = $('<ul></ul>');
        for (var i in links) {
            var l = links[i];
            
            appendLink(l.title, l.url);
        }
        content.append(list);
    
        
        $('body').append(element);
        
        element.addClass(options.position);
        element.css(options.position, '0px');
        element.css({
            'top': options.top + 'px'
        });
        button.css({
            'width': options.buttonWidth + 'px',
            'height': options.buttonHeight + 'px'
        });
        
        content.css({
            'width': options.contentWidth + 'px',
            'min-height': options.contentMinHeight + 'px',
            'right': (-1 * options.contentWidth) + 'px'
        });
        
        input.on('focus', function() {
            this.select();
        });
        
        input.on('keydown', function(e) {
            console.log(e);
            if (e.keyCode == 13) {
                $.fn.custommenu.addPage(
                    input.val(),
                    location.href
                );
            }
        });
        
        element.on('mouseenter', function() {
            showMenu();
        }).on('mouseleave', function() {
            hideMenu();
        });
        
        inputButton.on('click', function() {
            $.fn.custommenu.addPage(
                input.val(),
                location.href
            );
        });
        
        heading.append(options.menuName);
        var pageTitle = $(document).find("title").text();
        if (options.titleSeparator)
            pageTitle = pageTitle.split(options.titleSeparator, 1).valueOf();
        input.val($.trim(pageTitle));
        input.attr('title', pageTitle);
        
        return this;
    };
    
    function showMenu() {
        $(this).addClass('hover');
        button.stop().animate({right: options.contentWidth});
        content.stop().animate({right: 0});
    }
    
    function hideMenu() {
        $(this).removeClass('hover');
        button.stop().animate({right: 0});
        content.stop().animate({right: -1 * options.contentWidth});
    }
    
    function saveCookies() {
        var d = new Date();
        d.setTime(d.getTime() + (365*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        var domain = "; path=/; domain=." + window.location.host;
        document.cookie = 'custommenu=' + JSON.stringify(links) + "; " + expires + domain;
    };
    
    function appendLink(title, url) {
        var delButton = $('<button class="delButton"></button>');
        delButton.attr('title', options.strings.removePage);
        delButton.on('click', function() {
            $.fn.custommenu.removePage($(this).parent().index());
        });
    
        var listRow = $('<li></li>');
        listRow.append(delButton);
        listRow.append($('<a class="pageLink" href="' + url + '">' + title + '</a>'));
        list.append(listRow);
        
        console.log("Appended: " + title);
    }
    
    $.fn.custommenu.addPage = function(title, url) {
        try {
            links.push({
                title: title,
                url: url
            });
        }
        catch(err) {
            links = [];
        }
        
        saveCookies();
        
        appendLink(title, url);
    };
    
    $.fn.custommenu.removePage = function(index) {
        links.splice(index, 1);
        list.children().eq(index).remove();
        
        saveCookies();
    };
    
    $.fn.custommenu.defaults = {
        menuName: 'My custom menu',
        position: 'right',
        top: '60',
        buttonHeight: '32',
        buttonWidth: '32',
        contentWidth: '200',
        contentMinHeight: '220',
        titleSeparator: null,
        strings: {
            addPageLabel: 'Add page:',
            pageTitle: 'Page title',
            addPage: 'Add page',
            removePage: 'Remove page'
        }
    };
    
    $.custommenu = function(options) {
        $.fn.custommenu(options);
    };
}( jQuery ));
