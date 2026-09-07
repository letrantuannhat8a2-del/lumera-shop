import { NextResponse } from "next/server";

import { createClient } from "../../lib/supabase/sever";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type AddressBody = {
  id?: string;

  fullName?: string;
  phone?: string;

  country?: string;
  countryCode?: string;

  region?: string;
  city?: string;
  district?: string;

  street?: string;
  postalCode?: string;
};

async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error(
      "Get current user error:",
      error
    );
  }

  return user;
}

// =====================================================
// GET
// Load current user's addresses
// =====================================================

export async function GET() {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: addresses,
      error: addressesError,
    } =
      await supabaseAdmin
        .from("addresses")
        .select(`
          id,
          user_id,
          full_name,
          phone,
          country,
          country_code,
          region,
          city,
          district,
          street,
          postal_code,
          is_default,
          created_at,
          updated_at
        `)
        .eq(
          "user_id",
          user.id
        )
        .order(
          "is_default",
          {
            ascending: false,
          }
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (addressesError) {
      console.error(
        "Failed to load addresses:",
        addressesError
      );

      return NextResponse.json(
        {
          error:
            "Failed to load addresses.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        addresses:
          addresses ?? [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
          Pragma:
            "no-cache",
        },
      }
    );
  } catch (error) {
    console.error(
      "Addresses GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading addresses.",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// POST
// Create new address
// =====================================================

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as AddressBody;

    const fullName =
      typeof body.fullName ===
      "string"
        ? body.fullName.trim()
        : "";

    const phone =
      typeof body.phone ===
      "string"
        ? body.phone.trim()
        : "";

    const country =
      typeof body.country ===
      "string"
        ? body.country.trim()
        : "";

    const countryCode =
      typeof body.countryCode ===
      "string"
        ? body.countryCode
            .trim()
            .toUpperCase()
        : "";

    const region =
      typeof body.region ===
      "string"
        ? body.region.trim()
        : "";

    const city =
      typeof body.city ===
      "string"
        ? body.city.trim()
        : "";

    const district =
      typeof body.district ===
      "string"
        ? body.district.trim()
        : "";

    const street =
      typeof body.street ===
      "string"
        ? body.street.trim()
        : "";

    const postalCode =
      typeof body.postalCode ===
      "string"
        ? body.postalCode.trim()
        : "";

    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (!fullName) {
      return NextResponse.json(
        {
          error:
            "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          error:
            "Phone number is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!country) {
      return NextResponse.json(
        {
          error:
            "Country is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!countryCode) {
      return NextResponse.json(
        {
          error:
            "Country code is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!street) {
      return NextResponse.json(
        {
          error:
            "Street address is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // CREATE ADDRESS
    //
    // First address automatically becomes default.
    // =================================================

    const {
      count,
      error: countError,
    } =
      await supabaseAdmin
        .from("addresses")
        .select(
          "id",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "user_id",
          user.id
        );

    if (countError) {
      console.error(
        "Address count error:",
        countError
      );

      return NextResponse.json(
        {
          error:
            "Unable to create address.",
        },
        {
          status: 500,
        }
      );
    }

    const shouldBeDefault =
      (count ?? 0) === 0;

    // =================================================
    // IF THIS IS DEFAULT
    // REMOVE DEFAULT FROM OTHER USER ADDRESSES
    // =================================================

    if (shouldBeDefault) {
      const {
        error:
          clearDefaultError,
      } =
        await supabaseAdmin
          .from("addresses")
          .update({
            is_default: false,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "is_default",
            true
          );

      if (clearDefaultError) {
        console.error(
          "Clear default address error:",
          clearDefaultError
        );

        return NextResponse.json(
          {
            error:
              "Unable to create address.",
          },
          {
            status: 500,
          }
        );
      }
    }

    // =================================================
    // INSERT
    // =================================================

    const {
      data: address,
      error: insertError,
    } =
      await supabaseAdmin
        .from("addresses")
        .insert({
          user_id:
            user.id,

          full_name:
            fullName,

          phone:
            phone,

          country:
            country,

          country_code:
            countryCode,

          region:
            region || null,

          city:
            city || null,

          district:
            district || null,

          street:
            street,

          postal_code:
            postalCode || null,

          is_default:
            shouldBeDefault,
        })
        .select(`
          id,
          user_id,
          full_name,
          phone,
          country,
          country_code,
          region,
          city,
          district,
          street,
          postal_code,
          is_default,
          created_at,
          updated_at
        `)
        .single();

    if (insertError) {
      console.error(
        "Create address error:",
        insertError
      );

      return NextResponse.json(
        {
          error:
            "Unable to save this address.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        address,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(
      "Addresses POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while saving the address.",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// PATCH
// Set address as default
// =====================================================

export async function PATCH(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as AddressBody;

    const id =
      typeof body.id ===
      "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Address ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VERIFY ADDRESS BELONGS TO USER
    // =================================================

    const {
      data: existingAddress,
      error:
        existingAddressError,
    } =
      await supabaseAdmin
        .from("addresses")
        .select(
          "id, user_id"
        )
        .eq(
          "id",
          id
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (existingAddressError) {
      console.error(
        "Address lookup error:",
        existingAddressError
      );

      return NextResponse.json(
        {
          error:
            "Unable to update this address.",
        },
        {
          status: 500,
        }
      );
    }

    if (!existingAddress) {
      return NextResponse.json(
        {
          error:
            "Address not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // REMOVE DEFAULT FROM ALL OTHER ADDRESSES
    // =================================================

    const {
      error:
        clearDefaultError,
    } =
      await supabaseAdmin
        .from("addresses")
        .update({
          is_default:
            false,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "is_default",
          true
        );

    if (clearDefaultError) {
      console.error(
        "Clear default address error:",
        clearDefaultError
      );

      return NextResponse.json(
        {
          error:
            "Unable to update default address.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // SET SELECTED ADDRESS DEFAULT
    // =================================================

    const {
      data: address,
      error: updateError,
    } =
      await supabaseAdmin
        .from("addresses")
        .update({
          is_default:
            true,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          id
        )
        .eq(
          "user_id",
          user.id
        )
        .select(`
          id,
          user_id,
          full_name,
          phone,
          country,
          country_code,
          region,
          city,
          district,
          street,
          postal_code,
          is_default,
          created_at,
          updated_at
        `)
        .single();

    if (updateError) {
      console.error(
        "Set default address error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to set default address.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        address,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "Addresses PATCH error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the address.",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// DELETE
// Remove address
// =====================================================

export async function DELETE(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as AddressBody;

    const id =
      typeof body.id ===
      "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Address ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // GET ADDRESS
    // =================================================

    const {
      data: address,
      error:
        addressError,
    } =
      await supabaseAdmin
        .from("addresses")
        .select(
          "id, user_id, is_default"
        )
        .eq(
          "id",
          id
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (addressError) {
      console.error(
        "Address lookup error:",
        addressError
      );

      return NextResponse.json(
        {
          error:
            "Unable to remove this address.",
        },
        {
          status: 500,
        }
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          error:
            "Address not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // DELETE
    // =================================================

    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from("addresses")
        .delete()
        .eq(
          "id",
          id
        )
        .eq(
          "user_id",
          user.id
        );

    if (deleteError) {
      console.error(
        "Delete address error:",
        deleteError
      );

      return NextResponse.json(
        {
          error:
            "Unable to remove this address.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // IF DELETED ADDRESS WAS DEFAULT
    // MAKE MOST RECENT ADDRESS DEFAULT
    // =================================================

    if (address.is_default) {
      const {
        data:
          replacementAddress,
        error:
          replacementError,
      } =
        await supabaseAdmin
          .from("addresses")
          .select(
            "id"
          )
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
          .limit(1)
          .maybeSingle();

      if (replacementError) {
        console.error(
          "Find replacement default address error:",
          replacementError
        );
      }

      if (
        replacementAddress
      ) {
        const {
          error:
            replacementUpdateError,
        } =
          await supabaseAdmin
            .from("addresses")
            .update({
              is_default:
                true,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              replacementAddress.id
            )
            .eq(
              "user_id",
              user.id
            );

        if (
          replacementUpdateError
        ) {
          console.error(
            "Set replacement default address error:",
            replacementUpdateError
          );
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "Addresses DELETE error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while removing the address.",
      },
      {
        status: 500,
      }
    );
  }
}