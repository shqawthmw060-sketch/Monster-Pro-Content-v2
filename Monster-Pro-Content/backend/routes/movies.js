const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ==============================
// GET ALL MOVIES
// ==============================
router.get("/", (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    let total = 0;
    let rows = [];

    if (search !== "") {

        total = db.prepare(`
            SELECT COUNT(*) AS total
            FROM movies
            WHERE title LIKE ?
        `).get(`%${search}%`).total;

        rows = db.prepare(`
            SELECT *
            FROM movies
            WHERE title LIKE ?
            ORDER BY id DESC
            LIMIT ?
            OFFSET ?
        `).all(
            `%${search}%`,
            limit,
            offset
        );

    } else {

        total = db.prepare(`
            SELECT COUNT(*) AS total
            FROM movies
        `).get().total;

        rows = db.prepare(`
            SELECT *
            FROM movies
            ORDER BY id DESC
            LIMIT ?
            OFFSET ?
        `).all(
            limit,
            offset
        );

    }

    res.json({
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: rows
    });

});

// ==============================
// GET ONE MOVIE
// ==============================
router.get("/:id", (req, res) => {

    const movie = db.prepare(`
        SELECT *
        FROM movies
        WHERE id=?
    `).get(req.params.id);

    if (!movie) {

        return res.status(404).json({
            success: false,
            message: "Movie not found"
        });

    }

    res.json(movie);

});

// ==============================
// ADD MOVIE
// ==============================
router.post("/", (req, res) => {

    const stmt = db.prepare(`
        INSERT INTO movies(

            title,
            description,
            poster,
            backdrop,
            trailer,
            genre,
            year,
            language,
            rating,
            duration,
            stream_url,
            status

        )

        VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
    `);

    const result = stmt.run(

        req.body.title,
        req.body.description,
        req.body.poster,
        req.body.backdrop,
        req.body.trailer,
        req.body.genre,
        req.body.year,
        req.body.language,
        req.body.rating,
        req.body.duration,
        req.body.stream_url,
        req.body.status ?? 1

    );

    res.json({

        success: true,
        id: result.lastInsertRowid

    });

});

// ==============================
// UPDATE MOVIE
// ==============================
router.put("/:id", (req, res) => {

    db.prepare(`
        UPDATE movies

        SET

        title=?,
        description=?,
        poster=?,
        backdrop=?,
        trailer=?,
        genre=?,
        year=?,
        language=?,
        rating=?,
        duration=?,
        stream_url=?,
        status=?,
        updated_at=CURRENT_TIMESTAMP

        WHERE id=?
    `).run(

        req.body.title,
        req.body.description,
        req.body.poster,
        req.body.backdrop,
        req.body.trailer,
        req.body.genre,
        req.body.year,
        req.body.language,
        req.body.rating,
        req.body.duration,
        req.body.stream_url,
        req.body.status,
        req.params.id

    );

    res.json({
        success: true
    });

});

// ==============================
// DELETE MOVIE
// ==============================
router.delete("/:id", (req, res) => {

    db.prepare(`
        DELETE FROM movies
        WHERE id=?
    `).run(req.params.id);

    res.json({
        success: true
    });

});

// ==============================
// ENABLE / DISABLE MOVIE
// ==============================
router.put("/:id/status", (req, res) => {

    db.prepare(`
        UPDATE movies
        SET status=?
        WHERE id=?
    `).run(
        req.body.status ? 1 : 0,
        req.params.id
    );

    res.json({
        success: true
    });

});

// ==============================
// MOVIE STATISTICS
// ==============================
router.get("/stats/summary", (req, res) => {

    const total = db.prepare(`
        SELECT COUNT(*) AS total
        FROM movies
    `).get().total;

    const enabled = db.prepare(`
        SELECT COUNT(*) AS total
        FROM movies
        WHERE status=1
    `).get().total;

    const disabled = db.prepare(`
        SELECT COUNT(*) AS total
        FROM movies
        WHERE status=0
    `).get().total;

    res.json({

        total,
        enabled,
        disabled

    });

});

module.exports = router;