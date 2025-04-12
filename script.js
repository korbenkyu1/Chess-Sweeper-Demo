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
        if (level < 0) return
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
    
    squares.forEach((square, index) => {
        square.addEventListener('click', () => {
            if(loading) return
            if(numbers[index]) return
            square.dataset.piece = (parseInt(square.dataset.piece)+1) % 7
            scan()
        })
    })
    prev.addEventListener('click', e => {
        e.preventDefault()
        level -= 2
        loading = true
        load()
        scan()
    })
    next.addEventListener('click', e => {
        e.preventDefault()
        loading = true
        load()
        scan()
    })
    load()
})()
