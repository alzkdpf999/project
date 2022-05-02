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
                .offset(y: -60)
                .font(.title)
                

            Button(action: {
            }, label: {
               
                HStack{
                    Image("leftyellow")
                    
                    Text("무설탕으로 마시기")
                    .font(.system(size: 22))
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    Image("rightyellow")
                
                }
                .frame(width: 300, height: 160)
                .background(Color(red: 0.161, green: 0.349, blue: 0.51))
                .cornerRadius(30)
                .padding(.bottom, 40)
                
                
            })
           
            
            Button(action: {
            }, label: {
               
                HStack{
                    Image("leftred")
                    
                    Text("무설탕으로 마시기")
                    .font(.system(size: 22))
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    Image("rightred")
                
                }
                .frame(width: 300, height: 160)
                .background(Color(red: 0.435, green: 0.671, blue: 0.816))
                .cornerRadius(30)
                .padding(.bottom, 40)
                
                
            })

        }
    }
}
struct challenge_Previews: PreviewProvider {
    static var previews: some View {
       challenge()
    
    }
}

