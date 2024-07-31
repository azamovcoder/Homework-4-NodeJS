import { Users } from "../schema/userSchema.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    if (!users.length) {
      return res.status(404).json({
        msg: " Users is not defined",
        variant: "error",
        payload: null,
      });
    }
    res.status(200).json({
      msg: " All users",
      variant: "success",
      payload: users,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      variant: "error",
      payload: null,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await Users.findOne({
      $or: [{ username }],
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "Username is already exists",
        variant: "error",
        payload: null,
      });
    }

    const newUser = new Users({ username });
    await newUser.save();
    res.status(201).json({
      msg: "User created successfully",
      variant: "success",
      payload: newUser,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      variant: "error",
      payload: null,
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({
        msg: "User is not found",
        variant: "error",
        payload: null,
      });
    }

    await user.remove();
    res.status(200).json({
      msg: "User deleted successfully",
      variant: "success",
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      variant: "error",
      payload: null,
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({
        msg: "User is not found",
        variant: "error",
        payload: null,
      });
    }

    const existingUser = await Users.findOne({
      $or: [{ username }],
    });

    if (existingUser && existingUser.id !== id) {
      return res.status(400).json({
        msg: "Username is already exist",
        variant: "error",
        payload: null,
      });
    }

    user.username = username || user.username;

    await user.save();
    res.status(200).json({
      msg: "User updated successfully",
      variant: "success",
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      variant: "error",
      payload: null,
    });
  }
});

export default router;
