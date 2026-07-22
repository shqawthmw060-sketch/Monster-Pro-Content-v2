const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ===============================
// Get Channels (Pagination)
// ===============================
router.get("/", (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    let total = 0;
    let rows = [];

    if (search !== "") {

        total = db.prepare(`
            SELECT COUNT(*) AS total
            FROM channels
            WHERE
            name LIKE ?
            OR group_title LIKE ?
        `).get(
            `%${search}%`,
            `%${search}%`
        ).total;

        rows = db.prepare(`
            SELECT *
            FROM channels
            WHERE
            name LIKE ?
            OR group_title LIKE ?
            ORDER BY id DESC
            LIMIT ?
            OFFSET ?
        `).all(
            `%${search}%`,
            `%${search}%`,
            limit,
            offset
        );

    } else {

        total = db.prepare(`
            SELECT COUNT(*) AS total
            FROM channels
        `).get().total;

        rows = db.prepare(`
            SELECT *
            FROM channels
            ORDER BY id DESC
            LIMIT ?
            OFFSET ?
        `).all(limit, offset);

    }

    res.json({

        page,

        limit,

        total,

        pages: Math.ceil(total / limit),

        data: rows

    });

});

// ===============================
// Get One Channel
// ===============================

router.get("/:id", (req, res) => {

    const row = db.prepare(`
        SELECT *
        FROM channels
        WHERE id=?
    `).get(req.params.id);

    if (!row) {

        return res.status(404).json({

            success: false,

            message: "Channel Not Found"

        });

    }

    res.json(row);

});

// ===============================
// Add Channel
// ===============================

router.post("/", (req, res) => {

    const stmt = db.prepare(`

        INSERT INTO channels(

            name,

            tvg_id,

            tvg_logo,

            group_title,

            country,

            language,

            stream_url,

            status,

            selected

        )

        VALUES(?,?,?,?,?,?,?,?,?)

    `);

    const result = stmt.run(

        req.body.name || "",

        req.body.tvg_id || "",

        req.body.tvg_logo || "",

        req.body.group_title || "",

        req.body.country || "",

        req.body.language || "",

        req.body.stream_url || "",

        1,

        0

    );

    res.json({

        success: true,

        id: result.lastInsertRowid

    });

});

// ===============================
// Edit Channel
// ===============================

router.put("/:id", (req, res) => {

    db.prepare(`

        UPDATE channels

        SET

        name=?,

        tvg_logo=?,

        group_title=?,

        country=?,

        language=?,

        stream_url=?

        WHERE id=?

    `).run(

        req.body.name,

        req.body.tvg_logo,

        req.body.group_title,

        req.body.country,

        req.body.language,

        req.body.stream_url,

        req.params.id

    );

    res.json({

        success: true

    });

});

// ===============================
// Delete Channel
// ===============================

router.delete("/:id", (req, res) => {

    db.prepare(`

        DELETE FROM channels

        WHERE id=?

    `).run(req.params.id);

    res.json({

        success: true

    });

});

// ===============================
// Select Channel
// ===============================

router.put("/:id/select", (req, res) => {

    db.prepare(`

        UPDATE channels

        SET selected=?

        WHERE id=?

    `).run(

        req.body.selected ? 1 : 0,

        req.params.id

    );

    res.json({

        success: true

    });

});

// ===============================
// Select All
// ===============================

router.put("/select/all", (req, res) => {

    db.prepare(`

        UPDATE channels

        SET selected=1

    `).run();

    res.json({

        success: true

    });

});

// ===============================
// Unselect All
// ===============================

router.put("/select/none", (req, res) => {

    db.prepare(`

        UPDATE channels

        SET selected=0

    `).run();

    res.json({

        success: true

    });

});

// ===============================
// Selected Channels
// ===============================

router.get("/selected/list", (req, res) => {

    const rows = db.prepare(`

        SELECT *

        FROM channels

        WHERE selected=1

        ORDER BY name

    `).all();

    res.json(rows);

});

module.exports = router;