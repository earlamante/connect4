let game = {
        cs: 85, // cell size
        rows: 6,
        cols: 7,
        total: 0,
        loading: false,
        tries: 0,
        cpu: 0,
        winner: 0,
    };
(function ($) {
    let gs = $('#game'),
        cp = $('#current-player'),
        s = $('#settings'),
        d = $('#data');

    gs
        .on('click', '.dz', function (e) {
            e.preventDefault();
            if(game.loading) return;
            let c = $(this);
            game.loading = true;
            drop(c);
            setTimeout(function() {
                next_screen();
            }, 200);
        })
        .on('contextmenu', '.cell', function (e) {
            e.preventDefault();
        });

    function drop(c) {
        let col = c.data('col'),
            row = seek_vacant(col),
            n = cp.hasClass('piece--red') ? 1 : 2;
        c.find('.piece').css('opacity', 1);
        move(c, row, col);
        game.key[row][col] = n;
        check_winner(row, col);
    }

    function check_winner(row, col) {
        let p = game.key[row][col],
            s = 1;
        s = s + seek_pattern(col-1, row, -1, 0, p, 0);
        s = s + seek_pattern(col+1, row, 1, 0, p, 0);
        if(s >= 4) {
            game.winner = p;
            return;
        }
        s = 1;
        s = s + seek_pattern(col, row-1, 0, -1, p, 0);
        s = s + seek_pattern(col, row+1, 0, 1, p, 0);
        if(s >= 4) {
            game.winner = p;
            return;
        }
        s = 1;
        s = s + seek_pattern(col-1, row-1, -1, -1, p, 0);
        s = s + seek_pattern(col+1, row+1, 1, 1, p, 0);
        if(s >= 4) {
            game.winner = p;
            return;
        }
        s = 1;
        s = s + seek_pattern(col-1, row+1, -1, 1, p, 0);
        s = s + seek_pattern(col+1, row-1, 1, -1, p, 0);
        if(s >= 4) {
            game.winner = p;
        }
    }

    function seek_pattern(x, y, xp, yp, p, s) {
        if(x < 0 || x >= game.cols) return s;
        if(y < 0 || y >= game.rows) return s;
        if(game.key[y][x] === p) {
            return seek_pattern(x+xp, y+yp, xp, yp, p, s+1);
        }
        return s;
    }

    function seek_vacant(col) {
        let row = 0;
        for(let i=0; i<game.rows ;i++) {
            if(game.key[i][col] === '') row = i;
            else return row;
        }
        return row;
    }

    function init() {
        prepare();
        start();
    }

    function prepare() {
        let mw = $(window).outerWidth();
        mw = mw > 500 ? 500 : mw-10;
        game.cs = Math.floor(mw / game.cols);
        game.cs = game.cs > 100 ? 100 : game.cs;
    }

    function start() {
        game.key = generate();
        next_screen();
    }

    function next_screen() {
        gs.removeClass('ready');
        gs.html('');
        draw_board();
        gs.addClass('ready');

        if( game.winner ) {
            game_over();
        } else {
            change_player();
            draw_dropzone();
            game.loading = false;
        }
    }

    function game_over(full=true) {
        let msg = game.winner === 1 ? 'Red' : 'Blue';
            msg = msg + ' Wins!';
        setTimeout(function() {
            alert(msg);
        }, 100);
    }

    function generate() {
        let data = [];

        for(let i=0; i<game.rows ;i++) {
            let row = [];
            for(let j=0; j<game.cols ;j++) {
                row.push('');
            }
            data.push(row);
        }

        return data;
    }

    function move(elem, row, col) {
        elem.css({
            top: row * game.cs + 'px',
            left: col * game.cs + 'px'
        });
    }

    function change_player() {
        let cn = cp.hasClass('piece--red') ? 'piece--blue' : 'piece--red';
        cp.removeClass('piece--red').removeClass('piece--blue').addClass(cn);
    }

    function draw_dropzone() {
        for(let i=0; i<game.cols ;i++) {
            if(game.key[0][i]) continue;

            let elem = $('<div class="arrow" style="' +
                'width:' + game.cs + 'px;' +
                '"></div>'),
                pc = cp.hasClass('piece--red') ? 'piece--red' : 'piece--blue';
            cw = $('<div class="arrow-wrapper"></div>');
            cw.appendTo(elem);
            elem.appendTo(gs);
            elem.css({
                top: '-15px',
                left: i * game.cs + 'px'
            });

            elem = $('<div id="dz-'+ i +'" class="dz" data-col="'+ i +'" style="' +
                'width:' + game.cs + 'px;' +
                'height:' + game.cs + 'px;' +
                '"></div>');
            cw = $('<div class="dz-wrapper"><div class="piece '+ pc +'"></div></div>');
            cw.appendTo(elem);
            elem.appendTo(gs);
            elem.css({
                top: '-100px',
                left: i * game.cs + 'px'
            });
        }
    }

    function draw_board() {
        gs.css({
            width: game.cols * game.cs + 5 + 'px',
            height: game.rows * game.cs + 5 + 'px'
        });
        s.css('width', game.cols * game.cs + 5 + 'px');
        d.css('width', game.cols * game.cs + 5 + 'px');

        for(let i=0; i<game.rows ;i++) {
            for(let j=0; j<game.cols ;j++) {
                let elem = $('<div id="'+ i +'-'+ j +'" class="cell" style="' +
                    'width:'+ game.cs +'px;' +
                    'height:'+ game.cs +'px;' +
                    '"></div>'),
                    cw = $('<div class="piece-wrapper"></div>');

                if(game.key[i][j]) {
                    let c = $('<div class="piece"></div>');
                    if(game.key[i][j] === 1) c.addClass('piece--red');
                    else if(game.key[i][j] === 2) c.addClass('piece--blue');
                    c.appendTo(cw);
                }
                cw.appendTo(elem);
                elem.appendTo(gs);
                move(elem, i, j);
            }
        }
    }

    init();
})(jQuery);
