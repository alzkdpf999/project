//
//  challenge.swift
//  hci
//
//  Created by 정충효 on 2022/05/02.
//

import SwiftUI

struct challenge: View{
    var body: some View{
        VStack{
            Text("챌린지")
                .offset(y: -80)
                .font(.title)
                

            Button(action: {
            }, label: {
               
                HStack{
                    Image("challenge")
                    
                    Text("무설탕으로 마시기")
                   
                    .font(.system(size: 22))
                    .fontWeight(.bold)
                    .foregroundColor(.black)
                    .frame(width: 300.0, height: 160)
//                    .background(Color.blue)
                    .cornerRadius(30)
                
                }
            })
           
            
            Button(action: {
            }, label: {
                
                    Text("저카페인으로 마시기")
                    .font(.system(size: 22))
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
            })
            .padding(.all, 9.0)
            .frame(width: 300.0, height: 160)
            .background(Color.blue)
            .cornerRadius(30)

        }
    }
}
struct challenge_Previews: PreviewProvider {
    static var previews: some View {
       challenge()
    
    }
}
