<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = [
            [
                "name" => "Electronics & Software",
                "icon" => "cpu",
                "color" => "#546CFE",
                "children" => [
                    [
                        "name" => "Device",
                        "icon" => "monitor-smartphone"
                    ],
                    [
                        "name" => "SIM Card",
                        "icon" => "card-sim"
                    ],
                    [
                        "name" => "ESIM Card",
                        "icon" => "card-sim"
                    ],
                    [
                        "name" => "Multimedia",
                        "icon" => "folder-code"
                    ]
                ]
            ],
            [
                "name" => "Other",
                "icon" => "circle-question-mark",
                "color" => "#9E9E9E",
            ],
            [
                "name" => "Transfer",
                "icon" => "arrow-left-right",
                "color" => "#01BFA5",
                "children" => [
                    [
                        "name" => "Salary",
                        "icon" => "dollar-sign"
                    ],
                    [
                        "name" => "Claim",
                        "icon" => "hand-coins"
                    ],
                    [
                        "name" => "Gift",
                        "icon" => "gift"
                    ],
                    [
                        "name" => "Investment",
                        "icon" => "chart-candlestick"
                    ],
                    [
                        "name" => "Loan",
                        "icon" => "handshake",
                    ]
                ]
            ],
            [
                "name" => "Transport",
                "icon" => "navigation",
                "color" => "#AB47BD",
                "children" => [
                    [
                        "name" => "Airplane",
                        "icon" => "plane"
                    ],
                    [
                        "name" => "Bicycle",
                        "icon" => "bike"
                    ],
                    [
                        "name" => "Taxi",
                        "icon" => "car-taxi-front"
                    ],
                    [
                        "name" => "Train & Bus",
                        "icon" => "train-front"
                    ]
                ]
            ],
            [
                "name" => "Health & Personal Care",
                "icon" => "heart-pulse",
                "color" => "#FFB300",
                "children" => [
                    [
                        "name" => "Cosmetic",
                        "icon" => "mirror-round"
                    ],
                    [
                        "name" => "Haircut",
                        "icon" => "scissors"
                    ],
                    [
                        "name" => "Healthcare",
                        "icon" => "hospital"
                    ]
                ]
            ],
            [
                "name" => "Clothing & Footwear",
                "icon" => "shopping-bag",
                "color" => "#4FC3F7",
                "children" => [
                    [
                        "name" => "Accessories",
                        "icon" => "hat-glasses"
                    ],
                    [
                        "name" => "Clothes",
                        "icon" => "shirt"
                    ],
                    [
                        "name" => "Shoes",
                        "icon" => "footprints"
                    ]
                ]
            ],
            [
                "name" => "Food & Drinks",
                "icon" => "utensils",
                "color" => "#F44336",
                "children" => [
                    [
                        "name" => "Grocery",
                        "icon" => "apple"
                    ],
                    [
                        "name" => "Coffee",
                        "icon" => "coffee"
                    ],
                    [
                        "name" => "Restaurant",
                        "icon" => "soup"
                    ],
                    [
                        "name" => "Alcohol",
                        "icon" => "wine"
                    ],
                    [
                        "name" => "Dessert",
                        "icon" => "ice-cream-bowl"
                    ],
                    [
                        "name" => "Sweet Drink",
                        "icon" => "cup-soda"
                    ]
                ]
            ],
            [
                "name" => "Leisure & Hobby",
                "icon" => "party-popper",
                "color" => "#64DD17",
                "children" => [
                    [
                        "name" => "Venue Rental",
                        "icon" => "warehouse"
                    ],
                    [
                        "name" => "Class",
                        "icon" => "book-open"
                    ],
                    [
                        "name" => "Concert",
                        "icon" => "ticket"
                    ],
                    [
                        "name" => "Equipment",
                        "icon" => "toolbox"
                    ],
                    [
                        "name" => "Instrument",
                        "icon" => "guitar"
                    ],
                    [
                        "name" => "Membership",
                        "icon" => "id-card"
                    ],
                    [
                        "name" => "Merchandise",
                        "icon" => "heart"
                    ],
                    [
                        "name" => "Movie",
                        "icon" => "film"
                    ]
                ]
            ]
        ];

        foreach ($categories as $category) {
            $id = Str::slug($category["name"]);
            Category::create(compact("id") + collect($category)->except("children")->toArray());

            if (isset($category["children"])) {
                $base = ["color" => $category["color"], "parent_category_id" => $id];
                foreach ($category["children"] as $category) {
                    $id = Str::slug($category["name"]);
                    Category::create(compact("id") + $base + $category);
                }
            }
        }
    }
}
