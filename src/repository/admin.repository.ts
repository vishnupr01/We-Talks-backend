import mongoose from "mongoose";
import IAuth from "../entities/auth.entity";
import { IReport } from "../entities/report.entity";
import { AuthModel } from "../frameworks/models/auth.Model";
import { PostModel } from "../frameworks/models/post.model";
import { reportModel } from "../frameworks/models/report.Model";
import { UserModel } from "../frameworks/models/user.Model";
import IAdminRepository from "../interfaces/repositories/IAdmin.repository";

export class AdminRepository implements IAdminRepository {
  async getUsers(page: number) {
    try {
      // Use .lean() to get plain JavaScript objects
      const limit = 10
      const skip = ((page) - 1) * limit
      console.log(skip);
      const totalUsers = await UserModel.countDocuments({});
      const users = await UserModel.find({}).skip(skip).limit(limit)
      console.log(users);

      return { users, totalUsers }
    } catch (error) {
      throw error;
    }
  }
  async blockUser(email: string): Promise<boolean> {
    try {
      const updated = await UserModel.findOneAndUpdate({ email: email }, { $set: { isBlocked: true } })
      console.log(updated);
      return true
    } catch (error) {
      throw error
    }
  }
  async unblockUser(email: string): Promise<boolean> {
    try {
      const updated = await UserModel.findOneAndUpdate({ email: email }, { $set: { isBlocked: false } })
      console.log(updated);
      return true
    } catch (error) {
      throw error
    }
  }
  async detailsDay(): Promise<{ users: number[], posts: number[] }> {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6); // End of the week (Saturday)

      const days = Array.from({ length: 7 }, (_, i) => {
        const start = new Date(startOfWeek);
        start.setDate(start.getDate() + i);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        return { start, end };
      });

      const userCounts = await Promise.all(
        days.map(({ start, end }) =>
          UserModel.countDocuments({
            createdAt: { $gte: start, $lt: end },
          })
        )
      );

      const postCounts = await Promise.all(
        days.map(({ start, end }) =>
          PostModel.countDocuments({
            createdAt: { $gte: start, $lt: end },
          })
        )
      );

      return { users: userCounts, posts: postCounts };
    } catch (error) {
      console.error("Error fetching daily counts:", error);
      throw error;
    }
  }

  async detailsMonth(): Promise<{ users: number[], posts: number[] }> {
    try {
      const now = new Date();
      const months = Array.from({ length: 12 }, (_, i) => {
        const start = new Date(now.getFullYear(), i, 1);
        const end = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59, 999);
        return { start, end };
      });

      const userCounts = await Promise.all(
        months.map(({ start, end }) =>
          UserModel.countDocuments({
            createdAt: { $gte: start, $lte: end },
          })
        )
      );

      const postCounts = await Promise.all(
        months.map(({ start, end }) =>
          PostModel.countDocuments({
            createdAt: { $gte: start, $lte: end },
          })
        )
      );

      return { users: userCounts, posts: postCounts };
    } catch (error) {
      console.error("Error fetching monthly counts:", error);
      throw error;
    }
  }

  async detailsYear(): Promise<{ users: number[], posts: number[] }> {
    try {
      const now = new Date();
      const years = Array.from({ length: 3 }, (_, i) => {
        const year = now.getFullYear() - 2 + i;
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        return { year, start, end };
      });

      const userCounts = await Promise.all(
        years.map(({ start, end }) =>
          UserModel.countDocuments({
            createdAt: { $gte: start, $lte: end },
          })
        )
      );

      const postCounts = await Promise.all(
        years.map(({ start, end }) =>
          PostModel.countDocuments({
            createdAt: { $gte: start, $lte: end },
          })
        )
      );

      return { users: userCounts, posts: postCounts };
    } catch (error) {
      console.error("Error fetching yearly counts:", error);
      throw error;
    }
  }

  async totalDetails(): Promise<{ users: number, posts: number }> {
    try {
      const users = await UserModel.countDocuments({});
      const posts = await PostModel.countDocuments({})
      return { users: users, posts: posts };
    } catch (error) {
      throw error
    }
  }

  async getAllReports(): Promise<IReport[]> {
    try {
      const reports = await reportModel.aggregate([
        {
          $lookup: {
            from: 'users', // The name of the User collection
            localField: 'reporterId', // Field from Report collection
            foreignField: '_id', // Field from User collection
            as: 'reporterDetails' // Output array field
          }
        },
        {
          $unwind: '$reporterDetails' // Deconstruct the array from $lookup
        },
        {
          $project: {
            reportId: '$_id',
            postId: 1,
            description: 1,
            'reporterDetails.name': 1,
            'reporterDetails.email': 1,
            'reporterDetails.profileImg': 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ]);

      return reports;
    } catch (error) {
      throw error;
    }
  }


}

