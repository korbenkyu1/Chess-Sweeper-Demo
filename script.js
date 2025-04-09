import levels from "./levels.js"
(() => {
    const PIECE = {
        EMPTY: '0',
        PAWN: '1',
        KNIGHT: '2',
        BISHOP: '3',
        ROOK: '4',
        QUEEN: '5',
        KING: '6',
    }

    const squares = document.querySelectorAll('.square')
    let pieces = {}
    let numbers = []
    let level = 0
    let loading = true

    function load() {
        if (level >= levels.length) {
            alert("THANKS FOR PLAYING")
            return
        }
        pieces = levels[level].pieces
        numbers = levels[level].numbers
        current_level.innerText = ++level

        pawn_count.innerText = pieces.pawn
        knight_count.innerText = pieces.knight
        bishop_count.innerText = pieces.bishop
        rook_count.innerText = pieces.rook
        queen_count.innerText = pieces.queen
        king_count.innerText = pieces.king

        for (let i = 0; i < 64; i++) {
            squares[i].classList.remove('attacked')
            if (numbers[i]) {
                squares[i].dataset.number = numbers[i]
                squares[i].classList.add('attacked')
            }
            squares[i].dataset.piece = 0
        }

        loading = false
    }

    function scan() {
        const _pieces = {
            pawn: 0,
            knight: 0,
            bishop: 0,
            rook: 0,
            queen: 0,
            king: 0,
        }
        const _numbers = Array(64).fill(0)
        const attack = (x, y) => {
            if (x < 0 || y < 0 || x >= 8 || y >= 8) return false // (x, y) is out of the board
            if (squares[y * 8 + x].dataset.piece > 0) return false // piece is on the square
            _numbers[y * 8 + x]++
            return true
        }

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                switch (squares[y * 8 + x].dataset.piece) {
                    case PIECE.PAWN:
                        _pieces.pawn++
                        attack(x - 1, y - 1)
                        attack(x + 1, y - 1)
                        break

                    case PIECE.KNIGHT:
                        _pieces.knight++
                        attack(x - 1, y - 2)
                        attack(x + 1, y - 2)
                        attack(x + 2, y - 1)
                        attack(x + 2, y + 1)
                        attack(x + 1, y + 2)
                        attack(x - 1, y + 2)
                        attack(x - 2, y + 1)
                        attack(x - 2, y - 1)
                        break

                    case PIECE.BISHOP:
                        _pieces.bishop++
                        for (let i = 1; attack(x + i, y + i); i++);
                        for (let i = 1; attack(x - i, y + i); i++);
                        for (let i = 1; attack(x + i, y - i); i++);
                        for (let i = 1; attack(x - i, y - i); i++);
                        break

                    case PIECE.ROOK:
                        _pieces.rook++
                        for (let i = 1; attack(x + i, y); i++);
                        for (let i = 1; attack(x - i, y); i++);
                        for (let i = 1; attack(x, y + i); i++);
                        for (let i = 1; attack(x, y - i); i++);
                        break

                    case PIECE.QUEEN:
                        _pieces.queen++
                        for (let i = 1; attack(x + i, y + i); i++);
                        for (let i = 1; attack(x - i, y + i); i++);
                        for (let i = 1; attack(x + i, y - i); i++);
                        for (let i = 1; attack(x - i, y - i); i++);
                        for (let i = 1; attack(x + i, y); i++);
                        for (let i = 1; attack(x - i, y); i++);
                        for (let i = 1; attack(x, y + i); i++);
                        for (let i = 1; attack(x, y - i); i++);
                        break

                    case PIECE.KING:
                        _pieces.king++
                        attack(x - 1, y - 1)
                        attack(x, y - 1)
                        attack(x + 1, y - 1)
                        attack(x - 1, y)
                        attack(x + 1, y)
                        attack(x - 1, y + 1)
                        attack(x, y + 1)
                        attack(x + 1, y + 1)
                        break
                }
            }
        }

        for (let i = 0; i < 64; i++) squares[i].dataset.number = numbers[i] - _numbers[i]
        pawn_count.innerText = pieces.pawn - _pieces.pawn
        knight_count.innerText = pieces.knight - _pieces.knight
        bishop_count.innerText = pieces.bishop - _pieces.bishop
        rook_count.innerText = pieces.rook - _pieces.rook
        queen_count.innerText = pieces.queen - _pieces.queen
        king_count.innerText = pieces.king - _pieces.king

        if (JSON.stringify(_numbers) === JSON.stringify(numbers) && JSON.stringify(_pieces) === JSON.stringify(pieces)) {
            loading = true
            setTimeout(load, 250)
        }
    }
    
    let square = null
    let rect
    function poiner_down(e)
    {
        if (loading) return
        if(!e.target.classList.contains('square')) return
        if(parseInt(e.target.dataset.number) > 0) return

        square = e.target
        square.dataset.piece = PIECE.KING
        rect = square.getBoundingClientRect()
        flick.src = './assets/flick.png'
        flick.style.top = `${rect.top + rect.top - rect.bottom}px`
        flick.style.left = `${rect.left}px`
        flick.hidden = false
    }
    function pointer_move(e)
    {
        if(!square) return
        let x = e.x || e.touches[0].clientX
        let y = e.y || e.touches[0].clientY

        if(y < rect.top)
        {
            if(x < rect.left) flick.src = './assets/Bishop.png'
            else if(x < rect.right) flick.src = './assets/Pawn.png'
            else flick.src = './assets/Knight.png'
        }
        else if(y < rect.bottom)
        {
            if(x < rect.left) flick.src = './assets/Queen.png'
            else if(x < rect.right)  flick.src = './assets/flick.png'
            else flick.src = './assets/Rook.png'
        }
        else flick.src = './assets/Empty.png'
    }
    
    function pointer_up(e)
    {
        if(!square) return
        let x = e.x || e.touches[0].clientX
        let y = e.y || e.touches[0].clientY
        if(y < rect.top)
            {
                if(x < rect.left) square.dataset.piece = PIECE.BISHOP
                else if(x < rect.right) square.dataset.piece = PIECE.PAWN
                else square.dataset.piece = PIECE.KNIGHT
            }
            else if(y < rect.bottom)
            {
                if(x < rect.left) square.dataset.piece = PIECE.QUEEN
                else if(x < rect.right) square.dataset.piece = PIECE.KING
                else square.dataset.piece = PIECE.ROOK
            }
            else square.dataset.piece = PIECE.EMPTY
        square = null
        flick.hidden = true
        scan()
}

    document.addEventListener('mousedown', poiner_down)
    document.addEventListener('touchstart', poiner_down)
    document.addEventListener('mousemove', pointer_move)
    document.addEventListener('touchmove', pointer_move)
    document.addEventListener('mouseup', pointer_up)
    document.addEventListener('touchend', pointer_up)

    load()
})()
