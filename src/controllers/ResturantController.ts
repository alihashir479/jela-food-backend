import { Request, Response } from "express";
import Resturant from "../models/Resturant";

const searchResturant = async (req: Request, res: Response): Promise<any> => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";

    let query: any = {};

    query["city"] = new RegExp(city, "i");
    const cities = await Resturant.countDocuments(query);
    if (cities === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    const cuisinesArray = selectedCuisines
      .split(",")
      .map((cuisine) => new RegExp(cuisine, "i"));
    query["cuisines"] = {
      $all: cuisinesArray,
    };

    const searchRegex = new RegExp(searchQuery, "i");
    if (searchQuery) {
      query["$or"] = [
        { resturantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skipDocuments = (page - 1) * pageSize;

    const resturants = await Resturant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skipDocuments)
      .limit(pageSize)
      .lean();
    const totalDocuments = await Resturant.countDocuments(query);

    const response = {
      data: resturants,
      pagination: {
        total: totalDocuments,
        page,
        pages: Math.ceil(totalDocuments / pageSize),
      },
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Erro searching resturant" });
  }
};

const getResturant = async (req: Request, res: Response):Promise<any> => {
  try {
    const resturantId = req.params.resturantId
    const resturant = await Resturant.findById(resturantId)
    if(!resturant) {
      return res.status(404).json({ message: 'No resturant found!' })
    }
    res.json(resturant)
  }
  catch(err) {
    res.status(500).json({ message: 'Error fetching resturant!'})
  }
}

export { searchResturant, getResturant };
