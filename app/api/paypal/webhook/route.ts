import { NextResponse } from "next/server";

import { supabaseAdmin } 
from "@/app/lib/supabaseAdmin";


export async function POST(
  request: Request
){

  try {


    const body =
      await request.json();


    const eventId =
      body.id;


    const eventType =
      body.event_type;



    if(
      !eventId ||
      !eventType
    ){

      return NextResponse.json(
        {
          error:
          "Invalid webhook"
        },
        {
          status:400
        }
      );

    }



    // =========================
    // PREVENT DUPLICATE EVENT
    // =========================


    const {
      data: existing
    } =
    await supabaseAdmin
      .from(
        "paypal_webhook_events"
      )
      .select("id")
      .eq(
        "event_id",
        eventId
      )
      .maybeSingle();



    if(existing){

      return NextResponse.json({
        received:true
      });

    }



    // =========================
    // SAVE EVENT
    // =========================


    await supabaseAdmin
      .from(
        "paypal_webhook_events"
      )
      .insert({

        event_id:
          eventId,

        event_type:
          eventType,

        payload:
          body

      });



    console.log(
      "PAYPAL WEBHOOK:",
      eventType
    );



    // =========================
    // PAYMENT COMPLETED
    // =========================


    if(
      eventType ===
      "PAYMENT.CAPTURE.COMPLETED"
    ){


      const captureId =
        body.resource?.id;



      if(captureId){


        const {
          data: order
        } =
        await supabaseAdmin
          .from("orders")
          .select("*")
          .eq(
            "paypal_capture_id",
            captureId
          )
          .maybeSingle();



        if(order){


          await supabaseAdmin
            .from("orders")
            .update({

              payment_status:
                "paid"

            })
            .eq(
              "id",
              order.id
            );


        }


      }


    }



    return NextResponse.json({
      received:true
    });



  }
  catch(error){

    console.error(
      "PAYPAL WEBHOOK ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
        "Webhook failed"
      },
      {
        status:500
      }
    );

  }

}